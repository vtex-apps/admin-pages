import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import UpdateBlock from '../graphql/UpdateBlock.graphql'

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

export type UpdateBlockMutationFn = MutationFn<
  UpdateBlockData,
  UpdateBlockVariables
>

export interface MutationRenderProps extends MutationResult<UpdateBlockData> {
  updateBlock: UpdateBlockMutationFn
}

class UpdateBlockMutation extends Mutation<
  UpdateBlockData,
  UpdateBlockVariables
> {
  public static defaultProps = {
    mutation: UpdateBlock,
  }
}

export default UpdateBlockMutation
