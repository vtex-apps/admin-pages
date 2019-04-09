import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import DeleteStyle from '../graphql/DeleteStyle.graphql'

interface DeleteStyleData {
  deleteStyle: {
    id: string
    app: string
    name: string
  }
}

interface DeleteStyleVariables {
  id: string
}

export type DeleteStyleMutationFn = MutationFn<
  DeleteStyleData,
  DeleteStyleVariables
>

class DeleteStyleMutation extends Mutation<
  DeleteStyleData,
  DeleteStyleVariables
> {
  public static defaultProps = {
    mutation: DeleteStyle,
  }
}

export default DeleteStyleMutation
