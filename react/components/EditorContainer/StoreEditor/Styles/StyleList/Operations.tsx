import React from 'react'

import ListStyles from './graphql/ListStyles.graphql'
import CreateStyleMutation, {
  CreateStyleMutationFn,
} from './mutations/CreateStyle'
import DeleteStyleMutation, {
  DeleteStyleMutationFn,
} from './mutations/DeleteStyle'
import SaveSelectedStyleMutation, {
  SaveSelectedStyleMutationFn,
} from './mutations/SaveSelectedStyle'
import ListStylesQuery, { ListStylesQueryResult } from './queries/ListStyles'

interface Props {
  children: (mutations: OperationsObj) => JSX.Element | null
}

interface OperationsObj {
  listStyles: ListStylesQueryResult
  saveSelectedStyle: SaveSelectedStyleMutationFn
  createStyle: CreateStyleMutationFn
  deleteStyle: DeleteStyleMutationFn
}

const Operations = (props: Props) => (
  <ListStylesQuery fetchPolicy={'network-only'}>
    {listStyles => (
      <SaveSelectedStyleMutation
        refetchQueries={() => [{ query: ListStyles }]}
        awaitRefetchQueries
      >
        {saveSelectedStyle => (
          <CreateStyleMutation
            refetchQueries={() => [{ query: ListStyles }]}
            awaitRefetchQueries
          >
            {createStyle => (
              <DeleteStyleMutation
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
              </DeleteStyleMutation>
            )}
          </CreateStyleMutation>
        )}
      </SaveSelectedStyleMutation>
    )}
  </ListStylesQuery>
)

export default Operations
