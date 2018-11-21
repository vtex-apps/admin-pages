import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import { updateStoreAfterDelete, updateStoreAfterSave } from './utils'

interface Props {
  children: (mutations: OperationsObj) => React.ReactNode
}

interface OperationsObj {
  deleteRoute: MutationFn
  saveRoute: MutationFn
}

const Operations = (props: Props) => (
  <Mutation mutation={DeleteRoute} update={updateStoreAfterDelete}>
    {deleteRoute => (
      <Mutation mutation={SaveRoute} update={updateStoreAfterSave}>
        {saveRoute =>
          props.children({
            deleteRoute,
            saveRoute,
          })
        }
      </Mutation>
    )}
  </Mutation>
)

export default Operations
