import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import DeleteRedirect from '../../../../queries/DeleteRedirect.graphql'
import SaveRedirect from '../../../../queries/SaveRedirect.graphql'

import { getStoreUpdater } from './utils'

interface Props {
  children: (mutations: OperationsObj) => React.ReactNode
}

export interface OperationsObj {
  deleteRedirect: MutationFn
  saveRedirect: MutationFn
}

const Operations = (props: Props) => (
  <Mutation mutation={DeleteRedirect} update={getStoreUpdater('delete')}>
    {deleteRedirect => (
      <Mutation mutation={SaveRedirect} update={getStoreUpdater('save')}>
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
