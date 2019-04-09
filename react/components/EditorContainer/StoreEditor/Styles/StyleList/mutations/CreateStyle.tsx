import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import CreateStyle from '../graphql/CreateStyle.graphql'

interface CreateStyleData {
  createStyle: {
    id: string
    app: string
    name: string
  }
}

interface CreateStyleVariables {
  name: string
  config?: TachyonsConfig
}

export type CreateStyleMutationFn = MutationFn<
  CreateStyleData,
  CreateStyleVariables
>

class CreateStyleMutation extends Mutation<
  CreateStyleData,
  CreateStyleVariables
> {
  public static defaultProps = {
    mutation: CreateStyle,
  }
}

export default CreateStyleMutation
