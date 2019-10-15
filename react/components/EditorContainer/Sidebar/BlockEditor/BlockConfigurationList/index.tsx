import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'

import { getActiveContentId } from '../../../../../utils/components'
import { useEditorContext } from '../../../../EditorContext'
import { EditingState } from '../../typings'
import EditorHeader from '../EditorHeader'
import { getIsDefaultContent } from '../utils'

import Card from './Card'
import CreateButton from './CreateButton'
import { useListHandlers } from './hooks'
import { UseListHandlersParams } from './typings'

interface Props extends UseListHandlersParams {
  editingContentId: EditingState['contentId']
  onConfigurationCreate: () => void
  onConfigurationOpen: (configuration: ExtensionConfiguration) => void
  onListClose?: () => void
  onListOpen?: () => void
}

const messages = defineMessages({
  contentCards: {
    defaultMessage: 'Content cards',
    id: 'admin/pages.editor.component-list.contentCards',
  },
})

const BlockConfigurationList: React.FC<Props> = ({
  deleteContent,
  editingContentId,
  iframeRuntime,
  intl,
  onConfigurationCreate,
  onConfigurationOpen,
  onListClose,
  onListOpen,
  showToast,
}) => {
  const editor = useEditorContext()

  const { handleConfigurationDelete } = useListHandlers({
    deleteContent,
    iframeRuntime,
    intl,
    showToast,
  })

  const { configurations } = editor.blockData

  const activeContentId = React.useMemo(
    () =>
      getActiveContentId({
        extensions: iframeRuntime.extensions,
        treePath: editor.editTreePath,
      }),
    [editor.editTreePath, iframeRuntime.extensions]
  )

  if (!configurations) {
    return null
  }

  return (
    <div
      className="w-100 h-100 absolute bg-white"
      style={{ boxShadow: '-3px 0px 23px 0px rgba(0,0,0,0.14)' }}
    >
      <EditorHeader
        onListClose={onListClose}
        onListOpen={onListOpen}
        title={intl.formatMessage(messages.contentCards)}
      />

      <CreateButton onClick={onConfigurationCreate} />

      {configurations.map((configuration: ExtensionConfiguration, index) => {
        const isActiveConfiguration =
          configuration.contentId === activeContentId

        return (
          <Card
            configuration={configuration}
            isActive={isActiveConfiguration}
            isDefaultContent={getIsDefaultContent(configuration)}
            isEditing={editingContentId === configuration.contentId}
            key={configuration.contentId || index}
            onClick={onConfigurationOpen}
            onDelete={handleConfigurationDelete}
          />
        )
      })}
    </div>
  )
}

export default injectIntl(BlockConfigurationList)
