import React, { Component } from 'react'
import {
  Mutation,
  MutationFunction,
  MutationComponentOptions,
} from 'react-apollo'
import SaveSelectedStyle from '../graphql/SaveSelectedStyle.graphql'

interface SaveSelectedStyleData {
  saveSelectedStyle: {
    id: string
    app: string
    name: string
  }
}

interface SaveSelectedStyleVariables {
  id: string
}

export type SaveSelectedStyleMutationFn = MutationFunction<
  SaveSelectedStyleData,
  SaveSelectedStyleVariables
>

class SaveSelectedStyleMutation extends Component<
  MutationComponentOptions<SaveSelectedStyleData, SaveSelectedStyleVariables>
> {
  public static defaultProps = {
    mutation: SaveSelectedStyle,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<SaveSelectedStyleData, SaveSelectedStyleVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default SaveSelectedStyleMutation
