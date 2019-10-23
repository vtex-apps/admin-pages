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
  reset: {
    defaultMessage: 'Reset',
    id: 'admin/pages.editor.components.button.continue',
  },
  deleteActiveTitle: {
    defaultMessage: 'Delete active content',
    id: 'admin/pages.editor.components.modal.deleteActiveTitle',
  },
  deleteInactiveTitle: {
    defaultMessage: 'Delete content',
    id: 'admin/pages.editor.components.modal.deleteInactiveTitle',
  },
  deleteActiveText: {
    defaultMessage:
      'You are trying to delete an active content, the next content available will replace it. Are you sure you want to delete?',
    id: 'admin/pages.editor.components.modal.deleteActiveText',
  },
  deleteInactiveText: {
    defaultMessage: 'Are you sure you want to delete this content?',
    id: 'admin/pages.editor.components.modal.deleteInactiveText',
  },
  resetTitle: {
    defaultMessage: 'Reset configuration',
    id: 'admin/pages.editor.components.modal.resetTitle',
  },
  resetText: {
    defaultMessage:
      'You are trying to reset content created by an application, this action deletes any changes you’ve made. Are you sure you want to continue?',
    id: 'admin/pages.editor.components.modal.resetText',
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
