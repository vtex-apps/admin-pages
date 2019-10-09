import React from 'react'
import { injectIntl } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import EditorHeader from '../EditorHeader'
import { getIsDefaultContent } from '../utils'

import Card from './Card'
import CreateButton from './CreateButton'
import { useListHandlers } from './hooks'
import { UseListHandlersParams } from './typings'

interface Props extends UseListHandlersParams {
  onActiveConfigurationOpen: (configuration: ExtensionConfiguration) => void
  onConfigurationCreate: () => void
  onInactiveConfigurationOpen: (
    configuration: ExtensionConfiguration
  ) => Promise<void>
}

const BlockConfigurationList: React.FC<Props> = ({
  deleteContent,
  iframeRuntime,
  intl,
  onActiveConfigurationOpen,
  onBack,
  onConfigurationCreate,
  onInactiveConfigurationOpen,
  showToast,
}) => {
  const editor = useEditorContext()

  const { handleConfigurationDelete, handleQuit } = useListHandlers({
    deleteContent,
    iframeRuntime,
    intl,
    onBack,
    showToast,
  })

  const { configurations } = editor.blockData

  if (!configurations) {
    return null
  }

  return (
    <div className="w-100 flex flex-column">
      <EditorHeader onClose={handleQuit} title={editor.blockData.title} />

      <CreateButton onClick={onConfigurationCreate} />
      {configurations.map((configuration: ExtensionConfiguration, index) => {
        const isActiveConfiguration =
          editor.blockData.activeContentId === configuration.contentId

        return (
          <Card
            configuration={configuration}
            isActive={isActiveConfiguration}
            isDefaultContent={getIsDefaultContent(configuration)}
            key={configuration.contentId || index}
            onClick={
              isActiveConfiguration
                ? onActiveConfigurationOpen
                : onInactiveConfigurationOpen
            }
            onDelete={handleConfigurationDelete}
          />
        )
      })}
    </div>
  )
}

export default injectIntl(BlockConfigurationList)
