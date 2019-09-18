import React, {useEffect, useRef, useState } from 'react'
import { Spinner, ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import ComponentSelector from './ComponentSelector'
import ComponentEditor from './ComponentEditor'
import { FormDataContainer } from './typings'
import { getInitialComponents, getIsSitewide } from './utils'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

const Content = (props: Props) => {
  const { highlightHandler, iframeRuntime } = props

  const editor = useEditorContext()

  const [components, setComponents] = useState(() =>
    getInitialComponents({
      extensions: iframeRuntime.extensions,
      page: iframeRuntime.page,
    })
  )

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
              <ComponentEditor
                condition={
                  (state
                    ? state.condition
                    : {}) as ExtensionConfiguration['condition']
                }
                contentSchema={state.contentSchema}
                data={state.formData as FormDataContainer}
                iframeRuntime={iframeRuntime}
                isDefault
                isNew={false}
                isSitewide={isSitewide}
                onChange={handleFormChange}
                onClose={handleFormClose}
                onConditionChange={() => {}}
                onSave={() => {}}
                onTitleChange={() => {}}
                title={''}
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
