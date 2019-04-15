import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import UpdateStyle from '../graphql/UpdateStyle.graphql'

interface UpdateStyleData {
  updateStyle: {
    path: string
    selected: boolean
  }
}

interface UpdateStyleVariables {
  id: string
  config: TachyonsConfig
}

export type UpdateStyleFunction = MutationFn<UpdateStyleData, UpdateStyleVariables>

class UpdateStyleMutation extends Mutation<
  UpdateStyleData,
  UpdateStyleVariables
> {
  public static defaultProps = {
    mutation: UpdateStyle,
  }
}

export default UpdateStyleMutation
