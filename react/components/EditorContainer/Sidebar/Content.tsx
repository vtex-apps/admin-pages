import { JSONSchema6 } from 'json-schema'
import throttle from 'lodash/throttle'
import { equals } from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Spinner, ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import {
  getExtension,
  getIframeImplementation,
  getIframeRenderComponents,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../utils/components'

import { useEditorContext } from '../../EditorContext'
import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import ComponentSelector from './ComponentSelector'
import ContentEditor from './ConfigurationList/ContentEditor'
import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { FormDataContainer } from './typings'
import { getComponents, getIsSitewide } from './utils'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

interface State {
  condition?: ExtensionConfiguration['condition']
  content?: Extension['content']
  contentSchema?: JSONSchema6
  formData?: Extension['content']
}

const omitUndefined = (obj: Extension['content']) =>
  Object.entries(obj).reduce((acc, [currKey, currValue]) => {
    if (typeof currValue === 'undefined') {
      return acc
    }

    return { ...acc, [currKey]: currValue }
  }, {})

const getInitialComponents = ({
  extensions,
  page,
}: Pick<Props['iframeRuntime'], 'extensions' | 'page'>) =>
  getComponents(extensions, getIframeRenderComponents(), page)

const Content = (props: Props) => {
  const { highlightHandler, iframeRuntime } = props

  const editor = useEditorContext()
  const formMeta = useFormMetaContext()

  const modal = useModalContext()

  const [state, setState] = useState<State>({})

  const [components, setComponents] = useState(() =>
    getInitialComponents({
      extensions: iframeRuntime.extensions,
      page: iframeRuntime.page,
    })
  )

  const throttledUpdateExtensionFromForm = throttle(
    data => updateExtensionFromForm(data),
    200
  )

  const handleFormChange = useCallback(
    event => {
      if (
        state &&
        state.formData &&
        !formMeta.getWasModified() &&
        !equals(omitUndefined(state.formData), omitUndefined(event.formData))
      ) {
        formMeta.setWasModified(true)
      }

      if (event.formData && state) {
        setState({ ...state, formData: event.formData })

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
      state,
      throttledUpdateExtensionFromForm,
    ]
  )

  const handleConfigurationDiscard = useCallback(() => {
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

  }, [
    editor.editTreePath,
    formMeta,
    iframeRuntime,
    state.content,
  ])

  const handleFormClose = useCallback(() => {
    if (formMeta.getWasModified()) {
      modal.setHandlers({
        // actionHandler: handleConfigurationSave,
        cancelHandler: handleConfigurationDiscard,
      })
      modal.open()
    } else {
      setState({})
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
    state,
  ])

  const path = useRef('')

  useEffect(() => {
    if (path.current !== iframeRuntime.route.path) {
      setComponents(
        getInitialComponents({
          extensions: iframeRuntime.extensions,
          page: iframeRuntime.page,
        })
      )
      editor.setIsLoading(false)
      path.current = iframeRuntime.route.path
    }
  }, [
    editor,
    iframeRuntime.extensions,
    iframeRuntime.page,
    iframeRuntime.route.path,
  ])

  if (editor.editTreePath === null) {
    if (JSON.stringify(state) !== '{}') {
      setState({})
    }

    return (
      <ComponentSelector
        components={components}
        highlightHandler={highlightHandler}
        iframeRuntime={iframeRuntime}
        updateSidebarComponents={setComponents}
      />
    )
  }

  const editTreePath = editor.editTreePath || ''

  const blockId = iframeRuntime.extensions[editTreePath]
    ? iframeRuntime.extensions[editTreePath].blockId
    : ''

  const isSitewide = getIsSitewide(iframeRuntime.extensions, editTreePath)

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide
    ? getSitewideTreePath(editTreePath)
    : editTreePath

  return (
    <ToastConsumer>
    {() => (
      <ListContentQuery
      variables={{
        blockId,
          pageContext: iframeRuntime.route.pageContext,
          template,
          treePath: serverTreePath,
      }}
      >
      {({ data, loading }) => {
        if (!state.content || !state.contentSchema) {
          if (!loading) {
            const extension = getExtension(
              editTreePath,
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
          }

          return (
            <div className="mt9 flex justify-center">
            <Spinner />
            </div>
          )
        }

        return (
          <SaveContentMutation>
          {() => (
            <DeleteContentMutation>
            {() => (
              <ContentEditor
                componentTitle={''}
                condition={
                  (state
                    ? state.condition
                    : {}) as ExtensionConfiguration['condition']
                }
                contentSchema={state.contentSchema}
                data={state.formData as FormDataContainer}
                isDefault
                iframeRuntime={iframeRuntime}
                isNew={false}
                isSitewide={isSitewide}
                onClose={handleFormClose}
                onConditionChange={() => {}}
                onFormChange={handleFormChange}
                onTitleChange={() => {}}
                onSave={() => {}}
              />
            )}
            </DeleteContentMutation>
          )}
          </SaveContentMutation>
        )
      }}
      </ListContentQuery>
    )}
    </ToastConsumer>
  )
}

export default Content
