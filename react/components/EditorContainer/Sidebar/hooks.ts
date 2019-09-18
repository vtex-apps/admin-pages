import { equals } from 'ramda'
import { useCallback } from 'react'

import { updateExtensionFromForm } from '../../../utils/components'
import { useEditorContext } from '../../EditorContext'

import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { omitUndefined, throttledUpdateExtensionFromForm } from './utils'
import { UseFormHandlers } from './typings'

export const useFormHandlers: UseFormHandlers = ({
  iframeRuntime,
  setState,
  state,
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

  const handleFormClose = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.setHandlers({
        // TODO
        // actionHandler: handleFormSave,
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

      modal.open()
    } else {
      if (modal.getIsOpen()) {
        modal.close()
      }

      editor.setIsLoading(false)

      editor.editExtensionPoint(null)
    }
  }, [editor, formMeta, iframeRuntime, modal, state.content])

  return {
    handleFormChange,
    handleFormClose,
  }
}
