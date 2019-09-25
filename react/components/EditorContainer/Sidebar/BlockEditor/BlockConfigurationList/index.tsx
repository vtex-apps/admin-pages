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
//   deleteError: {
//     defaultMessage: 'Something went wrong. Please try again.',
//     id: 'admin/pages.editor.components.content.delete.error',
//   },
//   deleteSuccess: {
//     defaultMessage: 'Content deleted.',
//     id: 'admin/pages.editor.components.content.delete.success',
//   },
//   pageContextError: {
//     defaultMessage:
//       'Could not identify {entity}. The configuration will be set to "{template}".',
//     id: 'admin/pages.editor.components.condition.toast.error.page-context',
//   },
//   resetError: {
//     defaultMessage: 'Error resetting content.',
//     id: 'admin/pages.editor.components.content.reset.error',
//   },
//   resetSuccess: {
//     defaultMessage: 'Content reset.',
//     id: 'admin/pages.editor.components.content.reset.success',
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

  const { handleConfigurationDeletion, handleQuit } = useListHandlers({
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
          (configuration: ExtensionConfiguration, index: number) => (
            <Card
              configuration={configuration}
              isDefaultContent={getIsDefaultContent(configuration)}
              // TODO
              isDisabled={false}
              key={index}
              // TODO: choose between active/inactive based on ?
              onClick={() => {}}
              onDelete={handleConfigurationDeletion}
            />
          )
        )}
      </LoaderContainer>
    </Fragment>
  )
}

export default injectIntl(BlockConfigurationList)
