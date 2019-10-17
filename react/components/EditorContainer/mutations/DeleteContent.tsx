import React, { Component } from 'react'
import {
  Mutation,
  MutationFunction,
  MutationResult,
  MutationComponentOptions,
} from 'react-apollo'
import DeleteContent from '../graphql/DeleteContent.graphql'

interface DeleteContentData {
  deleteContent: string
}

interface DeleteContentVariables {
  pageContext: PageContext
  contentId: string
  template: string
  treePath: string
}

export type DeleteContentMutationFn = MutationFunction<
  DeleteContentData,
  DeleteContentVariables
>

export interface MutationRenderProps extends MutationResult<DeleteContentData> {
  deleteContent: DeleteContentMutationFn
}

class DeleteContentMutation extends Component<
  MutationComponentOptions<DeleteContentData, DeleteContentVariables>
> {
  public static defaultProps = {
    mutation: DeleteContent,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<DeleteContentData, DeleteContentVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default DeleteContentMutation
