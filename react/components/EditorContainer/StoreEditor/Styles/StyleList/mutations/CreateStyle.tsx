import { Mutation, MutationFunction, MutationComponentOptions } from 'react-apollo'
import CreateStyle from '../graphql/CreateStyle.graphql'
import { Component } from 'react'

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

export type CreateStyleMutationFn = MutationFunction<
  CreateStyleData,
  CreateStyleVariables
>

class CreateStyleMutation extends Component<MutationComponentOptions<CreateStyleData, CreateStyleVariables>> {
  public static defaultProps = {
    mutation: CreateStyle,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<CreateStyleData, CreateStyleVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default CreateStyleMutation
