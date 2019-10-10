import { Mutation, MutationFunction, MutationComponentOptions } from 'react-apollo'
import RenameStyle from '../graphql/RenameStyle.graphql'
import { Component } from 'react'

interface RenameStyleData {
  renameStyle: {
    id: string
  }
}

interface RenameStyleVariables {
  id: string
  name: string
}

export type RenameStyleFunction = MutationFunction<
  RenameStyleData,
  RenameStyleVariables
>

class RenameStyleMutation extends Component<MutationComponentOptions<RenameStyleData, RenameStyleVariables>> {
  public static defaultProps = {
    mutation: RenameStyle,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<RenameStyleData, RenameStyleVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default RenameStyleMutation
