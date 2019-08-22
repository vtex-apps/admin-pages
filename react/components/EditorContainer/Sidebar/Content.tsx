import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Spinner, ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { getIframeRenderComponents } from '../../../utils/components'

import { useEditorContext } from '../../EditorContext'
import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { useFormMetaContext } from './FormMetaContext'
import { useModalContext } from './ModalContext'
import { getComponents, getIsSitewide } from './utils'

interface Props {
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
  const { highlightHandler, iframeRuntime } = props

  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const modal = useModalContext()

  const initialComponents = useMemo(() => getInitialComponents(props), [props])

  const [components, setComponents] = useState(initialComponents)

  const path = useRef('')

  useEffect(() => {
    if (path.current !== iframeRuntime.route.path) {
      setComponents(getInitialComponents(props))
      editor.setIsLoading(false)
      path.current = iframeRuntime.route.path
    }
  }, [editor, iframeRuntime.route.path, props])

  if (editor.editTreePath === null) {
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

  const adaptedTreePath = isSitewide
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
            treePath: adaptedTreePath,
          }}
        >
          {({ data, loading, refetch }) => (
            <SaveContentMutation>
              {saveContent => (
                <DeleteContentMutation>
                  {deleteContent =>
                    loading ? (
                      <div className="mt9 flex justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      <ConfigurationList
                        deleteContent={deleteContent}
                        editor={editor}
                        formMeta={formMeta}
                        iframeRuntime={iframeRuntime}
                        isSitewide={isSitewide}
                        modal={modal}
                        queryData={data}
                        refetch={refetch}
                        saveContent={saveContent}
                        showToast={showToast}
                        template={template}
                        treePath={adaptedTreePath}
                      />
                    )
                  }
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
