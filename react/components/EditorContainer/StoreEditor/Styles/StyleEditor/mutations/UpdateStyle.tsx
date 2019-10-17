import React, { Component } from 'react'
import {
  Mutation,
  MutationFunction,
  MutationComponentOptions,
} from 'react-apollo'
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

export type UpdateStyleFunction = MutationFunction<
  UpdateStyleData,
  UpdateStyleVariables
>

class UpdateStyleMutation extends Component<
  MutationComponentOptions<UpdateStyleData, UpdateStyleVariables>
> {
  public static defaultProps = {
    mutation: UpdateStyle,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<UpdateStyleData, UpdateStyleVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default UpdateStyleMutation
