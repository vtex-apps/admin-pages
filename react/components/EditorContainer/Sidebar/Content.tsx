import React, { useEffect, useRef, useState } from 'react'
import { ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { getIframeRenderComponents } from '../../../utils/components'

import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'
import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { getComponents, getIsSitewide } from './utils'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

const getInitialComponents = (props: Props) =>
  getComponents(
    props.iframeRuntime.extensions,
    getIframeRenderComponents(),
    props.iframeRuntime.page
  )

const Content = (props: Props) => {
  const { editor, highlightHandler, iframeRuntime } = props

  const formMeta = useFormMetaContext()
  const modal = useModalContext()

  const [components, setComponents] = useState(getInitialComponents(props))

  const path = useRef('')

  useEffect(
    () => {
      if (path.current !== iframeRuntime.route.path) {
        setComponents(getInitialComponents(props))
        editor.setIsLoading(false)
      }
      path.current = iframeRuntime.route.path
    },
    [iframeRuntime]
  )

  if (editor.editTreePath === null) {
    return (
      <ComponentSelector
        components={components}
        editor={editor}
        highlightHandler={highlightHandler}
        iframeRuntime={iframeRuntime}
        updateSidebarComponents={setComponents}
      />
    )
  }

  const isSitewide = getIsSitewide(
    iframeRuntime.extensions,
    editor.editTreePath
  )

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const treePath = isSitewide
    ? getSitewideTreePath(editor.editTreePath)
    : editor.editTreePath!

  return (
    <ToastConsumer>
      {({ showToast }) => (
        <ListContentQuery
          variables={{
            blockId: iframeRuntime.extensions[editor.editTreePath!].blockId,
            pageContext: iframeRuntime.route.pageContext,
            template,
            treePath,
          }}
        >
          {listContentQueryResult => (
            <SaveContentMutation>
              {saveContent => (
                <DeleteContentMutation>
                  {deleteContent => (
                    <ConfigurationList
                      deleteContent={deleteContent}
                      editor={editor}
                      formMeta={formMeta}
                      iframeRuntime={iframeRuntime}
                      listContent={listContentQueryResult}
                      isSitewide={isSitewide}
                      modal={modal}
                      saveContent={saveContent}
                      showToast={showToast}
                      template={template}
                      treePath={treePath}
                    />
                  )}
                </DeleteContentMutation>
              )}
            </SaveContentMutation>
          )}
        </ListContentQuery>
      )}
    </ToastConsumer>
  )
}

export default Content
