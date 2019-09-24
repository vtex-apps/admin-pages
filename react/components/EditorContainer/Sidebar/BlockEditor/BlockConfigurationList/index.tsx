import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

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

const BlockConfigurationList: React.FC<UseListHandlersParams> = ({
  deleteContent,
  iframeRuntime,
  intl,
  isSitewide,
  onBack,
  serverTreePath,
  showToast,
  template,
}) => {
  const editor = useEditorContext()

  const componentTitle = React.useMemo(
    () =>
      formatIOMessage({
        id: editor.blockData.titleId || '',
        intl,
      }),
    [editor.blockData.titleId, intl]
  )

  const {
    handleConfigurationCreation,
    handleConfigurationDeletion,
    handleConfigurationOpen,
    handleQuit,
  } = useListHandlers({
    deleteContent,
    iframeRuntime,
    intl,
    isSitewide,
    onBack,
    serverTreePath,
    showToast,
    template,
  })

  const { configurations } = editor.blockData

  if (!configurations) {
    return null
  }

  return (
    <Fragment>
      <EditorHeader onClose={handleQuit} title={componentTitle} />

      <LoaderContainer>
        <CreateButton onClick={handleConfigurationCreation} />

        {configurations.map(
          (configuration: ExtensionConfiguration, index: number) => (
            <Card
              configuration={configuration}
              isDefaultContent={getIsDefaultContent(configuration)}
              // TODO
              isDisabled={false}
              isSitewide={isSitewide}
              key={index}
              onClick={handleConfigurationOpen}
              onDelete={handleConfigurationDeletion}
            />
          )
        )}
      </LoaderContainer>
    </Fragment>
  )
}

export default injectIntl(BlockConfigurationList)
