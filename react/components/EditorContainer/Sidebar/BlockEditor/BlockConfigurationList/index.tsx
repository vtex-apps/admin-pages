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
import { isConfigurationExpired } from './utils'

interface Props extends Omit<UseListHandlersParams, 'activeContentId'> {
  editingContentId: EditingState['contentId']
  onConfigurationCreate: () => void
  onConfigurationOpen: (configuration: ExtensionConfiguration) => void
  onListClose?: () => void
  onListOpen?: () => void
}

const messages = defineMessages({
  contentCards: {
    defaultMessage: 'Configurations',
    id: 'admin/pages.editor.component-list.title',
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

  const activeContentId = React.useMemo(
    () =>
      getActiveContentId({
        extensions: iframeRuntime.extensions,
        treePath: editor.editTreePath,
      }),
    [editor.editTreePath, iframeRuntime.extensions]
  )

  const { handleConfirmConfigurationDelete } = useListHandlers({
    activeContentId,
    deleteContent,
    iframeRuntime,
    intl,
    showToast,
  })

  if (!editor.blockData.configurations) {
    return null
  }

  const sortConfigurations = (
    current: ExtensionConfiguration,
    previous: ExtensionConfiguration
  ) => {
    const isActiveConfiguration = (configuration: ExtensionConfiguration) =>
      configuration.contentId === activeContentId

    const isAppConfiguration = (configuration: ExtensionConfiguration) =>
      configuration.origin

    if (isActiveConfiguration(current)) {
      return -1
    }

    if (isAppConfiguration(current)) {
      return 1
    }

    if (isAppConfiguration(previous)) {
      return -1
    }

    if (isConfigurationExpired(previous)) {
      return -1
    }

    if (isConfigurationExpired(current)) {
      return 1
    }

    return 0
  }

  const configurations = editor.blockData.configurations.sort(
    sortConfigurations
  )

  return (
    <div
      className="w-100 mh-100 absolute bg-white"
      style={{ boxShadow: '-3px 0px 23px 0px rgba(0,0,0,0.14)' }}
    >
      <EditorHeader
        onListClose={onListClose}
        onListOpen={onListOpen}
        title={intl.formatMessage(messages.contentCards)}
      />

      <CreateButton onClick={onConfigurationCreate} />

      {configurations.map((configuration: ExtensionConfiguration, index) => (
        <Card
          configuration={configuration}
          isActive={configuration.contentId === activeContentId}
          isDefaultContent={getIsDefaultContent(configuration)}
          isEditing={editingContentId === configuration.contentId}
          key={configuration.contentId || index}
          onClick={onConfigurationOpen}
          onDelete={handleConfirmConfigurationDelete}
        />
      ))}
    </div>
  )
}

export default injectIntl(BlockConfigurationList)
