import { equals, path } from 'ramda'
import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import {
  getActiveContentId,
  getSchemaPropsOrContent,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { useEditorContext } from '../../../EditorContext'
import { NEW_CONFIGURATION_ID } from '../consts'
import { useFormMetaContext } from '../FormMetaContext'
import { useModalContext } from '../ModalContext'
import { getFormData } from '../utils'

import { UseFormHandlers } from './typings'
import {
  getDefaultConfiguration,
  omitUndefined,
  throttledUpdateExtensionFromForm,
} from './utils'

const messages = defineMessages({
  cancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.editor.components.modal.form.button.cancel',
  },
  continue: {
    defaultMessage: 'Continue',
    id: 'admin/pages.editor.components.modal.form.button.continue',
  },
  discard: {
    defaultMessage: 'Discard',
    id: 'admin/pages.editor.components.modal.back.button.discard',
  },
  save: {
    defaultMessage: 'Save',
    id: 'admin/pages.editor.components.modal.back.button.save',
  },
  saveError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.toast.save.error',
  },
  saveSuccess: {
    defaultMessage: 'Content saved successfully.',
    id: 'admin/pages.editor.components.toast.save.success',
  },
  unsavedBackText: {
    defaultMessage:
      'Your unsaved changes will be lost. Do you want to save them?',
    id: 'admin/pages.editor.components.modal.back.text',
  },
  unsavedListText: {
    defaultMessage:
      'Your unsaved changes will be lost. Are you sure you want to continue?',
    id: 'admin/pages.editor.components.modal.form.text',
  },
  unsavedListTitle: {
    defaultMessage: 'Unsaved changes',
    id: 'admin/pages.editor.components.modal.form.title',
  },
})

export const useFormHandlers: UseFormHandlers = ({
  iframeRuntime,
  intl,
  saveContent,
  setState,
  showToast,
  state,
}) => {
  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const modal = useModalContext()

  const handleConditionChange = useCallback(
    (changes: Partial<typeof state['condition']>) => {
      setState({
        condition: {
          ...(state.condition as ExtensionConfiguration['condition']),
          ...changes,
        },
      })

      if (!formMeta.getWasModified()) {
        formMeta.setWasModified(true)
      }
    },
    [formMeta, setState, state]
  )

  const handleFormChange = useCallback(
    event => {
      if (
        state.formData &&
        !formMeta.getWasModified() &&
        !equals(omitUndefined(state.formData), omitUndefined(event.formData))
      ) {
        formMeta.setWasModified(true)
      }

      if (event.formData) {
        setState({ formData: event.formData })

        throttledUpdateExtensionFromForm({
          data: event.formData,
          isContent: true,
          runtime: iframeRuntime,
          treePath: editor.editTreePath,
        })
      }
    },
    [editor.editTreePath, formMeta, iframeRuntime, setState, state]
  )

  const handleFormClose = useCallback(async () => {
    if (!editor.getIsLoading()) {
      editor.setIsLoading(true)
    }

    await iframeRuntime.updateRuntime()

    editor.editExtensionPoint(null)

    editor.setIsLoading(false)
  }, [editor, iframeRuntime])

  const handleFormSave = useCallback(async () => {
    if (editor.getIsLoading()) {
      return
    }

    const content = getSchemaPropsOrContent({
      propsOrContent: state.formData,
      schema: editor.blockData.componentSchema,
    })

    const contentId =
      state.contentId === NEW_CONFIGURATION_ID ? null : state.contentId

    const configuration = {
      condition: state.condition,
      contentId,
      contentJSON: JSON.stringify(content),
      label: state.label || null,
      origin: state.origin || null,
    }

    const blockId = path<string>(
      ['extensions', editor.editTreePath || '', 'blockId'],
      iframeRuntime
    )

    let error: Error | undefined

    try {
      editor.setIsLoading(true)

      await saveContent({
        variables: {
          blockId,
          configuration,
          lang: iframeRuntime.culture.locale,
          template: editor.blockData.template,
          treePath: editor.blockData.serverTreePath,
        },
      })

      formMeta.setWasModified(false)

      handleFormClose()
    } catch (err) {
      console.error(err)

      error = err

      editor.setIsLoading(false)
    } finally {
      if (modal.getIsOpen()) {
        modal.close()
      }

      showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage(
          error ? messages.saveError : messages.saveSuccess
        ),
      })
    }
  }, [
    editor,
    formMeta,
    handleFormClose,
    iframeRuntime,
    intl,
    modal,
    saveContent,
    showToast,
    state.condition,
    state.contentId,
    state.formData,
    state.label,
    state.origin,
  ])

  const handleFormBack = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.open({
        actionHandler: async () => {
          await handleFormSave()
        },
        cancelHandler: () => {
          if (state.content) {
            updateExtensionFromForm({
              data: state.content,
              isContent: true,
              runtime: iframeRuntime,
              treePath: editor.editTreePath,
            })
          }

          formMeta.setWasModified(false, () => {
            handleFormBack()
          })
        },
        textButtonAction: intl.formatMessage(messages.save),
        textButtonCancel: intl.formatMessage(messages.discard),
        textMessage: intl.formatMessage(messages.unsavedBackText),
        title: intl.formatMessage(messages.unsavedListTitle),
      })
    } else {
      if (modal.getIsOpen()) {
        modal.close()
      }

      handleFormClose()
    }
  }, [
    editor,
    formMeta,
    handleFormClose,
    handleFormSave,
    iframeRuntime,
    intl,
    modal,
    state.content,
  ])

  const handleConfigurationOpen = useCallback(
    async (configuration: ExtensionConfiguration) => {
      if (!editor.editTreePath) {
        return
      }

      if (
        configuration.contentId &&
        state.contentId === configuration.contentId
      ) {
        setState({
          mode: state.prevMode,
        })
      } else {
        const baseContent =
          configuration.contentId !== NEW_CONFIGURATION_ID
            ? (JSON.parse(configuration.contentJSON) as Extension['content'])
            : {}

        const formData = getFormData({
          componentImplementation: editor.blockData.componentImplementation,
          content: baseContent,
          contentSchema: editor.blockData.contentSchema,
          iframeRuntime,
        })

        await iframeRuntime.updateExtension(editor.editTreePath, {
          ...iframeRuntime.extensions[editor.editTreePath],
          content: formData,
        })

        const activeContentId = getActiveContentId({
          extensions: iframeRuntime.extensions,
          treePath: editor.editTreePath,
        })

        const newMode =
          configuration.contentId && configuration.contentId === activeContentId
            ? 'editingActive'
            : 'editingInactive'

        setState({
          condition: configuration.condition,
          content: baseContent,
          contentId: configuration.contentId,
          formData,
          label: configuration.label,
          mode: newMode,
          origin: configuration.origin,
        })
      }
    },
    [
      editor.blockData.componentImplementation,
      editor.blockData.contentSchema,
      editor.editTreePath,
      iframeRuntime,
      setState,
      state.contentId,
      state.prevMode,
    ]
  )

  const handleConfigurationCreate = useCallback(
    () =>
      handleConfigurationOpen(
        getDefaultConfiguration({
          iframeRuntime,
          isSitewide: editor.blockData.isSitewide || false,
        })
      ),
    [editor.blockData.isSitewide, handleConfigurationOpen, iframeRuntime]
  )

  const handleLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ label: event.target.value })

      if (!formMeta.getWasModified()) {
        formMeta.setWasModified(true)
      }
    },
    [formMeta, setState]
  )

  const handleListClose = useCallback(() => {
    setState({ mode: state.prevMode })
  }, [setState, state.prevMode])

  const handleListOpen = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.open({
        actionHandler: async () => {
          editor.setIsLoading(true)

          if (state.content) {
            setState({
              formData: getFormData({
                componentImplementation:
                  editor.blockData.componentImplementation,
                content: state.content,
                contentSchema: editor.blockData.contentSchema,
                iframeRuntime,
              }),
            })
          }

          await iframeRuntime.updateRuntime()

          editor.setIsLoading(false)

          formMeta.setWasModified(false, () => {
            handleListOpen()
          })
        },
        cancelHandler: () => {
          modal.close()
        },
        isActionDanger: true,
        textButtonAction: intl.formatMessage(messages.continue),
        textButtonCancel: intl.formatMessage(messages.cancel),
        textMessage: intl.formatMessage(messages.unsavedListText),
        title: intl.formatMessage(messages.unsavedListTitle),
      })
    } else {
      if (modal.getIsOpen()) {
        modal.close()
      }

      setState({ mode: 'list' })
    }
  }, [editor, formMeta, iframeRuntime, intl, modal, setState, state.content])

  return {
    handleConditionChange,
    handleConfigurationCreate,
    handleConfigurationOpen,
    handleFormBack,
    handleFormChange,
    handleFormSave,
    handleLabelChange,
    handleListClose,
    handleListOpen,
  }
}
