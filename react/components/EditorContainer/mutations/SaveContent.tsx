import React, { Component } from 'react'
import {
  Mutation,
  MutationFunction,
  MutationResult,
  MutationComponentOptions,
} from 'react-apollo'
import SaveContent from '../graphql/SaveContent.graphql'

interface SaveContentData {
  saveContent: Pick<ExtensionConfiguration, 'contentId'>
}

interface SaveContentVariables {
  blockId?: string
  configuration: Omit<ExtensionConfiguration, 'contentId'> & {
    contentId: string | null
  }
  lang: RenderContext['culture']['locale']
  template: string
  treePath: string
}

export type SaveContentMutationFn = MutationFunction<
  SaveContentData,
  SaveContentVariables
>

export interface MutationRenderProps extends MutationResult<SaveContentData> {
  SaveContent: SaveContentMutationFn
}

class SaveContentMutation extends Component<
  MutationComponentOptions<SaveContentData, SaveContentVariables>
> {
  public static defaultProps = {
    mutation: SaveContent,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<SaveContentData, SaveContentVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default SaveContentMutation
