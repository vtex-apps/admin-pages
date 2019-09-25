import { equals, path } from 'ramda'
import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import {
  updateExtensionFromForm,
  getSchemaPropsOrContent,
} from '../../../../utils/components'
import { useEditorContext } from '../../../EditorContext'
import ListContent from '../../graphql/ListContent.graphql'
import { useFormMetaContext } from '../FormMetaContext'
import { useModalContext } from '../ModalContext'

import { NEW_CONFIGURATION_ID } from './consts'
import { UseFormHandlers } from './typings'
import {
  getDefaultConfiguration,
  getFormData,
  omitUndefined,
  throttledUpdateExtensionFromForm,
} from './utils'

const messages = defineMessages({
  saveError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.components.content.save.error',
  },
  saveSuccess: {
    defaultMessage: 'Content saved.',
    id: 'admin/pages.editor.components.content.save.success',
  },
})

export const useFormHandlers: UseFormHandlers = ({
  iframeRuntime,
  intl,
  query,
  saveMutation,
  setState,
  showToast,
  state,
}) => {
  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const modal = useModalContext()

  const handleActiveConfigurationOpen = useCallback(() => {
    // TODO: maybe refetch
    setState({ mode: 'editingActive' })
  }, [setState])

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

  const handleFormSave = useCallback(async () => {
    if (editor.getIsLoading()) {
      return
    }

    const content = getSchemaPropsOrContent({
      propsOrContent: state.formData,
      schema: editor.blockData.componentSchema,
    })

    const configuration = {
      condition: state.condition,
      contentId: state.contentId,
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

      const { id, template, serverTreePath } = editor.blockData

      const refetchQueries =
        id && serverTreePath && template
          ? [
              {
                query: ListContent,
                variables: {
                  blockId: id,
                  pageContext: iframeRuntime.route.pageContext,
                  template: template,
                  treePath: serverTreePath,
                },
              },
            ]
          : undefined

      await saveMutation({
        refetchQueries,
        variables: {
          blockId,
          configuration,
          lang: iframeRuntime.culture.locale,
          template: editor.blockData.template,
          treePath: editor.blockData.serverTreePath,
        },
      })

      formMeta.setWasModified(false)
    } catch (err) {
      if (modal.getIsOpen()) {
        modal.close()
      }

      console.error(err)

      error = err
    } finally {
      editor.setIsLoading(false)

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
    iframeRuntime,
    intl,
    modal,
    saveMutation,
    showToast,
    state.condition,
    state.contentId,
    state.formData,
    state.label,
    state.origin,
  ])

  const handleFormClose = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.open({
        actionHandler: async () => {
          await handleFormSave()

          handleFormClose()
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
            handleFormClose()
          })
        },
      })
    } else {
      if (modal.getIsOpen()) {
        modal.close()
      }

      editor.setIsLoading(false)

      if (state.mode === 'editingActive') {
        editor.editExtensionPoint(null)
      } else if (state.mode === 'editingInactive') {
        setState({ mode: 'list' })
      }
    }
  }, [
    editor,
    formMeta,
    handleFormSave,
    iframeRuntime,
    modal,
    setState,
    state.content,
    state.mode,
  ])

  const handleInactiveConfigurationOpen = useCallback(
    async (configuration: ExtensionConfiguration) => {
      if (!editor.editTreePath) {
        return
      }

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

      setState({ formData, mode: 'editingInactive' })
    },
    [
      editor.blockData.componentImplementation,
      editor.blockData.contentSchema,
      editor.editTreePath,
      iframeRuntime,
      setState,
    ]
  )

  const handleConfigurationCreate = useCallback(
    () =>
      handleInactiveConfigurationOpen(
        getDefaultConfiguration({
          iframeRuntime,
          isSitewide: editor.blockData.isSitewide || false,
        })
      ),
    [
      editor.blockData.isSitewide,
      handleInactiveConfigurationOpen,
      iframeRuntime,
    ]
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

  const handleListOpen = useCallback(() => {
    setState({ mode: 'list' })
  }, [setState])

  return {
    handleActiveConfigurationOpen,
    handleConditionChange,
    handleConfigurationCreate,
    handleFormChange,
    handleFormClose,
    handleFormSave,
    handleInactiveConfigurationOpen,
    handleLabelChange,
    handleListOpen,
  }
}
