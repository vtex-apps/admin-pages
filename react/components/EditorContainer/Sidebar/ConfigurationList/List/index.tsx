import React, { Fragment } from 'react'
import { MutationFn } from 'react-apollo'
import ContentContainer from '../../ContentContainer'
import EditorHeader from '../../EditorHeader'
import { DeleteContentVariables } from '../typings'

import Card from './Card'
import CreateButton from './CreateButton'

interface Props {
  configurations: ExtensionConfiguration[]
  editor: EditorContext
  isDisabledChecker: (configuration: ExtensionConfiguration) => boolean
  iframeRuntime: RenderContext
  isSitewide: boolean
  onClose: () => void
  onDelete: MutationFn<{ deleteContent: string }, DeleteContentVariables>
  onCreate: (event: Event) => void
  onSelect: (configuration: ExtensionConfiguration) => void
  path: string
  title?: string
}

const List: React.SFC<Props> = ({
  configurations,
  editor,
  isDisabledChecker,
  iframeRuntime,
  isSitewide,
  onClose,
  onCreate,
  onDelete,
  onSelect,
  path,
  title,
}) => (
  <Fragment>
    <EditorHeader editor={editor} onClose={onClose} title={title} />
    <ContentContainer isLoading={editor.isLoading}>
      {configurations.map(
        (configuration: ExtensionConfiguration, index: number) => (
          <Card
            configuration={configuration}
            onDelete={() => {
              onDelete({
                variables: {
                  contentId: configuration.contentId,
                  pageContext: iframeRuntime.route.pageContext,
                  template: iframeRuntime.pages[iframeRuntime.page].blockId,
                  treePath: editor.editTreePath!,
                },
              })
            }}
            isDisabled={isDisabledChecker(configuration)}
            isSitewide={isSitewide}
            key={index}
            onClick={onSelect}
            path={path}
          />
        )
      )}
      <CreateButton onClick={onCreate} />
    </ContentContainer>
  </Fragment>
)

export default List
