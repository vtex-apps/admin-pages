import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import { useModalContext } from '../../ModalContext'
import { getIsDefaultContent } from '../utils'

import { UseListHandlers } from './typings'
import { getDeleteStoreUpdater } from './utils'

const messages = defineMessages({
  deleteError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.delete.error',
  },
  deleteSuccess: {
    defaultMessage: 'Content deleted successfully.',
    id: 'admin/pages.editor.components.content.delete.success',
  },
  resetError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.reset.error',
  },
  resetSuccess: {
    defaultMessage: 'Content reset successfully.',
    id: 'admin/pages.editor.components.content.reset.success',
  },
  cancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.editor.components.modal.button.cancel',
  },
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.editor.components.button.delete',
  },
  deleteActiveTitle: {
    defaultMessage: 'Delete active content',
    id: 'admin/pages.editor.components.modal.deleteActiveTitle',
  },
  deleteActiveText: {
    defaultMessage:
      'You are trying to delete an active configuration which will cause another one to take its place. Are you sure you want to delete it?',
    id: 'admin/pages.editor.components.modal.deleteActiveText',
  },
  deleteInactiveTitle: {
    defaultMessage: 'Delete content',
    id: 'admin/pages.editor.components.modal.deleteInactiveTitle',
  },
  deleteInactiveText: {
    defaultMessage: 'Are you sure you want to delete this content?',
    id: 'admin/pages.editor.components.modal.deleteInactiveText',
  },
})

export const useListHandlers: UseListHandlers = ({
  activeContentId,
  deleteContent,
  iframeRuntime,
  intl,
  showToast,
}) => {
  const editor = useEditorContext()

  const modal = useModalContext()

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

          await iframeRuntime.updateRuntime()

          editor.editExtensionPoint(null)
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

  const handleConfirmConfigurationDelete = useCallback(
    (configuration: ExtensionConfiguration) => {
      const textMessageByType = {
        active: messages.deleteActiveText,
        inactive: messages.deleteInactiveText,
      }

      const configurationType =
        activeContentId === configuration.contentId ? 'active' : 'inactive'

      modal.open({
        isActionDanger: true,
        textButtonAction: intl.formatMessage(messages.delete),
        textButtonCancel: intl.formatMessage(messages.cancel),
        textMessage: intl.formatMessage(textMessageByType[configurationType]),
        actionHandler: async () => {
          await handleConfigurationDelete(configuration)
          modal.close()
        },
        cancelHandler: () => {
          modal.close()
        },
      })
    },
    [modal, handleConfigurationDelete, activeContentId, intl]
  )

  return {
    handleConfirmConfigurationDelete,
    handleConfigurationDelete,
  }
}
