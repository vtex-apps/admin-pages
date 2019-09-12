import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import DeleteContent from '../graphql/DeleteContent.graphql'

interface DeleteContentData {
  deleteContent: string
}

interface DeleteContentVariables {
  pageContext: PageContext
  contentId: string | null
  template: string
  treePath: string
}

export type DeleteContentMutationFn = MutationFn<
  DeleteContentData,
  DeleteContentVariables
>

export interface MutationRenderProps extends MutationResult<DeleteContentData> {
  deleteContent: DeleteContentMutationFn
}

class DeleteContentMutation extends Mutation<
  DeleteContentData,
  DeleteContentVariables
> {
  public static defaultProps = {
    mutation: DeleteContent,
  }
}

export default DeleteContentMutation
