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
  onConfigurationCreate: () => void
  onConfigurationOpen: (configuration: ExtensionConfiguration) => void
  onListClose?: () => void
  onListOpen?: () => void
}

const BlockConfigurationList: React.FC<Props> = ({
  deleteContent,
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

  if (!configurations) {
    return null
  }

  return (
    <div className="w-100 h-100 absolute bg-white">
      <EditorHeader
        onListClose={onListClose}
        onListOpen={onListOpen}
        title={editor.blockData.title}
      />

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
            onClick={onConfigurationOpen}
            onDelete={handleConfigurationDelete}
          />
        )
      })}
    </div>
  )
}

export default injectIntl(BlockConfigurationList)
