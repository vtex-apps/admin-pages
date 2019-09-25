import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import { getIsDefaultContent } from '../utils'

import { UseListHandlers } from './typings'
import { getDeleteStoreUpdater } from './utils'

const messages = defineMessages({
  deleteError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.delete.error',
  },
  deleteSuccess: {
    defaultMessage: 'Content deleted.',
    id: 'admin/pages.editor.components.content.delete.success',
  },
  resetError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.reset.error',
  },
  resetSuccess: {
    defaultMessage: 'Content reset.',
    id: 'admin/pages.editor.components.content.reset.success',
  },
})

export const useListHandlers: UseListHandlers = ({
  deleteContent,
  iframeRuntime,
  intl,
  onBack,
  showToast,
}) => {
  const editor = useEditorContext()

  // TODO
  //     if (isUnidentifiedPageContext(pageContext)) {
  //       showToast({
  //         horizontalPosition: 'right',
  //         message: intl.formatMessage(
  //           {
  //             id: messages.pageContextError.id,
  //           },
  //           {
  //             entity: intl.formatMessage({
  //               id: `admin/pages.editor.components.condition.scope.entity.${pageContext.type}`,
  //             }),
  //             template: intl.formatMessage({
  //               id: 'admin/pages.editor.components.condition.scope.template',
  //             }),
  //           }
  //         ),
  //       })
  //     }

  const handleConfigurationDelete = useCallback(
    async (configuration: ExtensionConfiguration) => {
      editor.setIsLoading(true)

      const action = getIsDefaultContent(configuration) ? 'reset' : 'delete'

      const {
        blockData: { id: blockId, serverTreePath, template },
        setBlockData,
      } = editor

      if (blockId && serverTreePath && template) {
        let wasSuccessful = true

        try {
          await deleteContent({
            update: getDeleteStoreUpdater({
              blockId,
              iframeRuntime,
              serverTreePath,
              setBlockData,
              template,
            }),
            variables: {
              contentId: configuration.contentId,
              pageContext: iframeRuntime.route.pageContext,
              template,
              treePath: serverTreePath,
            },
          })
        } catch (error) {
          wasSuccessful = false

          console.error(error)
        } finally {
          const messageKey = action + (wasSuccessful ? 'Success' : 'Error')

          editor.setIsLoading(false)

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(
              messages[messageKey as keyof typeof messages]
            ),
          })
        }
      }
    },
    [deleteContent, editor, iframeRuntime, intl, showToast]
  )

  const handleQuit = useCallback(
    (event?: Event) => {
      if (event) {
        event.stopPropagation()
      }

      onBack()
    },
    [onBack]
  )

  return {
    handleConfigurationDelete,
    handleQuit,
  }
}
