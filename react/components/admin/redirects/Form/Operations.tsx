import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import DeleteRedirect from '../../../../queries/DeleteRedirect.graphql'
import SaveRedirect from '../../../../queries/SaveRedirect.graphql'

import {
  DeleteRedirectMutationFn,
  DeleteRedirectVariables,
  RedirectData,
  SaveRedirectMutationFn,
  SaveRedirectVariables,
} from './typings'
import { getStoreUpdater } from './utils'

interface Props {
  children: (mutations: OperationsObj) => React.ReactNode
}

interface OperationsObj {
  deleteRedirect: DeleteRedirectMutationFn
  saveRedirect: SaveRedirectMutationFn
}

const Operations = (props: Props) => (
  <Mutation<RedirectData, DeleteRedirectVariables>
    mutation={DeleteRedirect}
    update={getStoreUpdater('delete')}
  >
    {deleteRedirect => (
      <Mutation<RedirectData, SaveRedirectVariables>
        mutation={SaveRedirect}
        update={getStoreUpdater('save')}
      >
        {saveRedirect =>
          props.children({
            deleteRedirect,
            saveRedirect,
          })
        }
      </Mutation>
    )}
  </Mutation>
)

export default Operations
