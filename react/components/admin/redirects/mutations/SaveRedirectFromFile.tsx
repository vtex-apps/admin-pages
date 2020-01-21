import { Mutation, MutationFn, MutationResult } from 'react-apollo'

import SaveRedirectFromFile from './SaveRedirectFromFile.graphql'

interface SaveRedirectFromFileData {
  saveRedirectFromFile: boolean
}

export type UploadActionType = 'save' | 'delete'

interface SaveRedirectFromFileVariables {
  redirects: Redirect[]
}

type SaveRedirectFromFileMutationFn = MutationFn<
  SaveRedirectFromFileData,
  SaveRedirectFromFileVariables
>

export interface MutationRenderProps
  extends MutationResult<SaveRedirectFromFileData> {
  saveRedirectFromFile: SaveRedirectFromFileMutationFn
}

class SaveRedirectFromFileMutation extends Mutation<
  SaveRedirectFromFileData,
  SaveRedirectFromFileVariables
> {
  public static defaultProps = {
    mutation: SaveRedirectFromFile,
  }
}

export default SaveRedirectFromFileMutation
