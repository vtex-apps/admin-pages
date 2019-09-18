import { JSONSchema6 } from 'json-schema'
import { equals } from 'ramda'
import { useCallback, useEffect, useState} from 'react'
import { useEditorContext } from '../../EditorContext'

import { } from './utils'

import {
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../utils/components'

import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'


interface State {
  condition?: ExtensionConfiguration['condition']
  content?: Extension['content']
  contentSchema?: JSONSchema6
  formData?: Extension['content']
}

const formMeta = useFormMetaContext()

const modal = useModalContext()

const omitUndefined = (obj: Extension['content']) =>
  Object.entries(obj).reduce((acc, [currKey, currValue]) => {
    if (typeof currValue === 'undefined') {
      return acc
    }

    return { ...acc, [currKey]: currValue }
  }, {})

const editor = useEditorContext()

export const useFormState = ({ iframeRuntime, data }) => {
  const [state, setState] = useState<State>({})

  useEffect(() => {
    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    const listContent = data && data.listContentWithSchema

    // TODO: get contentSchema from iframeRuntime so query is not needed
    const contentSchema =
      listContent && JSON.parse(listContent.schemaJSON)

    const activeContent =
      listContent && listContent.content && listContent.content[0]

    const content =
      (activeContent &&
        activeContent.contentJSON &&
        JSON.parse(activeContent.contentJSON)) ||
      {}

    const condition = activeContent && activeContent.condition

    const formData =
      getSchemaPropsOrContentFromRuntime({
        component: getIframeImplementation(extension.component),
        contentSchema,
        isContent: true,
        messages: iframeRuntime.messages,
        propsOrContent: content,
        runtime: iframeRuntime,
      }) || {}

    setState({
      condition,
      content,
      contentSchema,
      formData,
    })
  }, [])

  return { state, setState }
}

export const useFormHandlers = ({ formState, setFormState, iframeRuntime }) => {
  const handleFormChange = useCallback(
    event => {
      if (
        formState &&
        formState.formData &&
        !formMeta.getWasModified() &&
        !equals(omitUndefined(formState.formData), omitUndefined(event.formData))
      ) {
        formMeta.setWasModified(true)
      }

      if (event.formData && formState) {
        setFormState({ ...formState, formData: event.formData })

        throttledUpdateExtensionFromForm({
          data: event.formData,
          isContent: true,
          runtime: iframeRuntime,
          treePath: editor.editTreePath,
        })
      }
    },
    [
      editor.editTreePath,
      formMeta,
      iframeRuntime,
      formState,
      throttledUpdateExtensionFromForm,
    ]
  )

  const handleFormClose = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.setHandlers({
        // actionHandler: handleFormSave,
        cancelHandler: handleFormDiscard,
      })
      modal.open()
    } else {
      setFormState({})
      if (modal.getIsOpen()) {
        modal.close()
      }
      editor.setIsLoading(false)
      editor.editExtensionPoint(null)
    }
  }, [
    editor.editTreePath,
    formMeta,
    iframeRuntime,
    formState,
  ])

  const handleFormDiscard = useCallback(() => {
    if (formState.content) {
      updateExtensionFromForm({
        data: formState.content,
        isContent: true,
        runtime: iframeRuntime,
        treePath: editor.editTreePath,
      })
    }

    formMeta.setWasModified(false, () => {
      handleFormClose()
    })

  }, [
    editor.editTreePath,
    formMeta,
    iframeRuntime,
    formState.content,
  ])

  return {
    handleFormChange,
    handleFormClose,
  }
}


