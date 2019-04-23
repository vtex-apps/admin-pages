import React from 'react'
import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import SaveRedirectFromFile from '../graphql/SaveRedirectFromFile.graphql'

interface SaveRedirectFromFileData {
  saveRedirectFromFile: boolean
}

export type UploadActionType = 'merge' | 'overwrite'

interface SaveRedirectFromFileVariables {
  file: File | FileList | Blob
  uploadActionType: UploadActionType
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
