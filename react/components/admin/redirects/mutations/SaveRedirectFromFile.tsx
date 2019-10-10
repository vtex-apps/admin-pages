import { Mutation, MutationFunction, MutationResult, MutationComponentOptions } from 'react-apollo'
import SaveRedirectFromFile from '../graphql/SaveRedirectFromFile.graphql'
import { Component } from 'react'

interface SaveRedirectFromFileData {
  saveRedirectFromFile: boolean
}

export type UploadActionType = 'merge' | 'overwrite'

interface SaveRedirectFromFileVariables {
  file: File | FileList | Blob
  uploadActionType: UploadActionType
}

type SaveRedirectFromFileMutationFn = MutationFunction<
  SaveRedirectFromFileData,
  SaveRedirectFromFileVariables
>

export interface MutationRenderProps
  extends MutationResult<SaveRedirectFromFileData> {
  saveRedirectFromFile: SaveRedirectFromFileMutationFn
}

class SaveRedirectFromFileMutation extends Component<MutationComponentOptions<SaveRedirectFromFileData, SaveRedirectFromFileVariables>> {
  public static defaultProps = {
    mutation: SaveRedirectFromFile,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<SaveRedirectFromFileData, SaveRedirectFromFileVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default SaveRedirectFromFileMutation
