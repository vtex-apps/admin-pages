import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import SaveContent from '../graphql/SaveContent.graphql'

interface SaveContentData {
  saveContent: Pick<ExtensionConfiguration, 'contentId'>
}

interface SaveContentVariables {
  configuration: Omit<ExtensionConfiguration, 'contentId'> & {
    contentId: string | null
  }
  template: string
  treePath: string
}

export type SaveContentMutationFn = MutationFn<
  SaveContentData,
  SaveContentVariables
>

export interface MutationRenderProps extends MutationResult<SaveContentData> {
  SaveContent: SaveContentMutationFn
}

class SaveContentMutation extends Mutation<
  SaveContentData,
  SaveContentVariables
> {
  public static defaultProps = {
    mutation: SaveContent,
  }
}

export default SaveContentMutation
