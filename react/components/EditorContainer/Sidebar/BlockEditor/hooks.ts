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
  saveError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.save.error',
  },
  saveSuccess: {
    defaultMessage: 'Content saved successfully.',
    id: 'admin/pages.editor.components.content.save.success',
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
      if (modal.getIsOpen()) {
        modal.close()
      }

      console.error(err)

      error = err

      editor.setIsLoading(false)
    } finally {
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
    setState({ mode: 'list' })
  }, [setState])

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
