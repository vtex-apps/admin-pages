import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import { getIsDefaultContent } from '../utils'

import { UseListHandlers } from './typings'
import { getDeleteStoreUpdater } from './utils'
import { getActiveContentId } from '../../../../../utils/components'

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
  showToast,
}) => {
  const editor = useEditorContext()

  const handleConfigurationDelete = useCallback(
    async (configuration: ExtensionConfiguration) => {
      editor.setIsLoading(true)

      const action = getIsDefaultContent(configuration) ? 'reset' : 'delete'

      const {
        blockData: { id: blockId, serverTreePath, template },
        setBlockData,
      } = editor

      if (blockId && serverTreePath && template) {
        const { contentId } = configuration

        const activeContentId = getActiveContentId({
          extensions: iframeRuntime.extensions,
          treePath: editor.editTreePath,
        })

        const isActive = contentId === activeContentId

        let wasSuccessful = true

        try {
          await deleteContent({
            update: getDeleteStoreUpdater({
              action,
              blockId,
              iframeRuntime,
              serverTreePath,
              setBlockData,
              template,
            }),
            variables: {
              contentId,
              pageContext: iframeRuntime.route.pageContext,
              template,
              treePath: serverTreePath,
            },
          })

          if (isActive) {
            await iframeRuntime.updateRuntime()
          }
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

  return {
    handleConfigurationDelete,
  }
}
