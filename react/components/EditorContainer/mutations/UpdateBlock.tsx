import { Mutation, MutationFunction, MutationResult, MutationComponentOptions } from 'react-apollo'
import UpdateBlock from '../graphql/UpdateBlock.graphql'
import { Component } from 'react'

interface UpdateBlockData {
  updateBlock: boolean
}

interface UpdateBlockVariables {
  block: BlockInput
  blockPath: BlockPathItem[]
}

interface BlockInsertionInput {
  blockId: string
  extensionPointId: string
}

interface BlockInput {
  propsJSON: string
  blocks: BlockInsertionInput[]
  after: string[]
  around: string[]
  before: string[]
}

interface BlockPathItem {
  role: BlockRole
  id: string
}

export type UpdateBlockMutationFn = MutationFunction<
  UpdateBlockData,
  UpdateBlockVariables
>

export interface MutationRenderProps extends MutationResult<UpdateBlockData> {
  updateBlock: UpdateBlockMutationFn
}

class UpdateBlockMutation extends Component<MutationComponentOptions<UpdateBlockData, UpdateBlockVariables>> {
  public static defaultProps = {
    mutation: UpdateBlock,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<UpdateBlockData, UpdateBlockVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default UpdateBlockMutation
