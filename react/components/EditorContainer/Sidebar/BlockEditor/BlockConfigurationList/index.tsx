import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import EditorHeader from '../EditorHeader'
import LoaderContainer from '../LoaderContainer'
import { getIsDefaultContent } from '../utils'

import Card from './Card'
import CreateButton from './CreateButton'
import { useListHandlers } from './hooks'
import { UseListHandlersParams } from './typings'

// TODO
//
// const messages = defineMessages({
//   pageContextError: {
//     defaultMessage:
//       'Could not identify {entity}. The configuration will be set to "{template}".',
//     id: 'admin/pages.editor.components.condition.toast.error.page-context',
//   },
// })

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
    <Fragment>
      <EditorHeader onClose={handleQuit} title={editor.blockData.title} />

      <LoaderContainer>
        <CreateButton onClick={onConfigurationCreate} />

        {configurations.map(
          (configuration: ExtensionConfiguration, index: number) => {
            const isActiveConfiguration = editor.blockData.activeContentId === configuration.contentId
            return (
              <Card
                configuration={configuration}
                isDefaultContent={getIsDefaultContent(configuration)}
                isActive={isActiveConfiguration}
                // TODO
                isDisabled={false}
                key={index}
                // TODO: choose between active/inactive based on ?
                onClick={isActiveConfiguration ? onActiveConfigurationOpen : onInactiveConfigurationOpen}
                onDelete={handleConfigurationDelete}
              />
            )
          }
        )}
      </LoaderContainer>
    </Fragment>
  )
}

export default injectIntl(BlockConfigurationList)
