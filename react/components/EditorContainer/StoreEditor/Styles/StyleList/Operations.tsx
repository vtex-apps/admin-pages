import React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import CreateStyle from './queries/CreateStyle.graphql'
import DeleteStyle from './queries/DeleteStyle.graphql'
import ListStyles from './queries/ListStyles.graphql'
import SaveSelectedStyle from './queries/SaveSelectedStyle.graphql'

interface Props {
  children: (mutations: OperationsObj) => React.ReactNode
}

interface ListStyles {
  listStyles: Style[]
}

interface OperationsObj {
  listStyles: QueryResult<ListStyles>
  saveSelectedStyle: MutationFn
  createStyle: MutationFn
  deleteStyle: MutationFn
}

const Operations = (props: Props) => (
  <Query query={ListStyles} fetchPolicy={'no-cache'}>
    {listStyles => (
      <Mutation
        mutation={SaveSelectedStyle}
        refetchQueries={() => [{ query: ListStyles }]}
        awaitRefetchQueries
      >
        {saveSelectedStyle => (
          <Mutation
            mutation={CreateStyle}
            refetchQueries={() => [{ query: ListStyles }]}
          >
            {createStyle => (
              <Mutation
                mutation={DeleteStyle}
                refetchQueries={() => [{ query: ListStyles }]}
                awaitRefetchQueries
              >
                {deleteStyle =>
                  props.children({
                    createStyle,
                    deleteStyle,
                    listStyles,
                    saveSelectedStyle,
                  })
                }
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    )}
  </Query>
)

export default Operations
