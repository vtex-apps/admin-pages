import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Spinner, ToastConsumer } from 'vtex.styleguide'
import throttle from 'lodash/throttle'
import { equals } from 'ramda'
import { JSONSchema6 } from 'json-schema'

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
import ContentEditor from './ConfigurationList/ContentEditor'
import { FormDataContainer } from './typings'

import ComponentSelector from './ComponentSelector'
// import ConfigurationList from './ConfigurationList'
import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { getComponents, getIsSitewide } from './utils'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

type State = {
  condition: ExtensionConfiguration['condition']
  content: Extension['content']
  contentSchema: JSONSchema6
  formData: Extension['content']
} | null

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

  const [state, setState] = useState<State>(null)

  const handleFormChange = useCallback(event => {
    debugger
    // if (
    //   formData &&
    //   !formMeta.getWasModified() &&
    //   !equals(omitUndefined(formData), omitUndefined(event.formData))
    // ) {
    //   formMeta.setWasModified(true)
    // }

    // if (event.formData) {
    //   setFormData({ formData: event.formData })

    //   throttledUpdateExtensionFromForm({
    //     data: event.formData,
    //     isContent: true,
    //     runtime: iframeRuntime,
    //     treePath: editor.editTreePath,
    //   })
    // }
  }, [])

  const path = useRef('')

  useEffect(
    () => {
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
    },
    [
      editor,
      iframeRuntime.extensions,
      iframeRuntime.page,
      iframeRuntime.route.path,
    ]
  )

  if (editor.editTreePath === null) {
    if (state) {
      setState(null)
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
      {({ showToast }) => (
        <ListContentQuery
          variables={{
            blockId,
            pageContext: iframeRuntime.route.pageContext,
            template,
            treePath: serverTreePath,
          }}
        >
          {({ data, loading, refetch }) => {
            if (!state) {
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
                  listContent && listContent.content && listContent.content[0] || {} as ExtensionConfiguration

                const content = ((activeContent.contentJSON &&
                  JSON.parse(activeContent.contentJSON)) ||
                  {}) as Extension['content']

                const { condition } = activeContent

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
                {saveContent => (
                  <DeleteContentMutation>
                    {deleteContent => (
                      <ContentEditor
                        componentTitle={'Teste'}
                        condition={state.condition}
                        contentSchema={state.contentSchema}
                        data={state.formData as FormDataContainer}
                        iframeRuntime={iframeRuntime}
                        isDefault={true}
                        isNew={false}
                        isSitewide={isSitewide}
                        onClose={() => {
                          editor.editExtensionPoint(null)
                        }}
                        onConditionChange={() => {
                          debugger
                        }}
                        onFormChange={handleFormChange}
                        onTitleChange={() => {
                          debugger
                        }}
                        onSave={() => {
                          debugger
                        }}
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
