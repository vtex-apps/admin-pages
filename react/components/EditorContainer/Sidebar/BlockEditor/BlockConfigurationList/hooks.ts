import { useCallback } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import { useModalContext } from '../../ModalContext'
import { getIsDefaultContent } from '../utils'

import { ConfigurationType } from '../typings'
import { UseListHandlers } from './typings'
import { getConfigurationType } from '../utils'
import { getDeleteStoreUpdater } from './utils'

const messages = defineMessages({
  cancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.editor.components.modal.list.delete.button.cancel',
  },
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.editor.components.modal.list.delete.button.delete',
  },
  deleteActiveText: {
    defaultMessage:
      'You are trying to delete the active content. The next available content will take its place. Are you sure you want to continue? This action cannot be undone.',
    id: 'admin/pages.editor.components.modal.list.delete.active.text',
  },
  deleteActiveTitle: {
    defaultMessage: 'Delete active content',
    id: 'admin/pages.editor.components.modal.list.delete.active.title',
  },
  deleteError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.toast.delete.error',
  },
  deleteInactiveText: {
    defaultMessage:
      'Are you sure you want to delete this content? This action cannot be undone.',
    id: 'admin/pages.editor.components.modal.list.delete.inactive.text',
  },
  deleteInactiveTitle: {
    defaultMessage: 'Delete content',
    id: 'admin/pages.editor.components.modal.list.delete.inactive.title',
  },
  reset: {
    defaultMessage: 'Reset',
    id: 'admin/pages.editor.components.modal.list.reset.button.reset',
  },
  deleteSuccess: {
    defaultMessage: 'Content deleted successfully.',
    id: 'admin/pages.editor.components.toast.delete.success',
  },
  resetError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.toast.reset.error',
  },
  resetSuccess: {
    defaultMessage: 'Content reset successfully.',
    id: 'admin/pages.editor.components.toast.reset.success',
  },
  resetTitle: {
    defaultMessage: 'Reset content from an app',
    id: 'admin/pages.editor.components.modal.list.reset.title',
  },
  resetText: {
    defaultMessage:
      "You are trying to reset content created by an application. This action will discard any changes you've made. Are you sure you want to continue? This action cannot be undone.",
    id: 'admin/pages.editor.components.modal.list.reset.text',
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
      const textMessageByType: Record<
        ConfigurationType,
        FormattedMessage.MessageDescriptor
      > = {
        active: messages.deleteActiveText,
        inactive: messages.deleteInactiveText,
        app: messages.resetText,
      }

      const titleByType: Record<
        ConfigurationType,
        FormattedMessage.MessageDescriptor
      > = {
        active: messages.deleteActiveTitle,
        inactive: messages.deleteInactiveTitle,
        app: messages.resetTitle,
      }

      const buttonMessageByType: Record<
        ConfigurationType,
        FormattedMessage.MessageDescriptor
      > = {
        active: messages.delete,
        inactive: messages.delete,
        app: messages.reset,
      }

      const configurationType = getConfigurationType({
        configuration,
        activeContentId,
      })

      modal.open({
        isActionDanger: true,
        title: intl.formatMessage(titleByType[configurationType]),
        textButtonAction: intl.formatMessage(
          buttonMessageByType[configurationType]
        ),
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
