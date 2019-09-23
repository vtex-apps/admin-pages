import { equals, path } from 'ramda'
import { useCallback } from 'react'
import { defineMessages } from 'react-intl'

import {
  updateExtensionFromForm,
  getSchemaPropsOrContent,
} from '../../../utils/components'
import { useEditorContext } from '../../EditorContext'

import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { omitUndefined, throttledUpdateExtensionFromForm } from './utils'
import { UseFormHandlers } from './typings'

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
  saveMutation,
  serverTreePath,
  setState,
  showToast,
  state,
  template,
}) => {
  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const modal = useModalContext()

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

    // TODO
    // const label =
    //   this.state.newLabel !== undefined
    //     ? this.state.newLabel
    //     : this.state.configuration.label

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

      await saveMutation({
        variables: {
          blockId,
          configuration,
          lang: iframeRuntime.culture.locale,
          template,
          treePath: serverTreePath,
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
    serverTreePath,
    showToast,
    state.condition,
    state.contentId,
    state.formData,
    state.label,
    state.origin,
    template,
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

      editor.editExtensionPoint(null)
    }
  }, [editor, formMeta, handleFormSave, iframeRuntime, modal, state.content])

  const handleLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ label: event.target.value })

      if (!formMeta.getWasModified()) {
        formMeta.setWasModified(true)
      }
    },
    [formMeta, setState]
  )

  return {
    handleFormChange,
    handleFormClose,
    handleFormSave,
    handleLabelChange,
  }
}
