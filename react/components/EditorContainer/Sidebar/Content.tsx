import React, { useEffect, useRef, useState } from 'react'
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
          {({ data, loading, refetch }) => (
            <SaveContentMutation>
              {saveContent => (
                <DeleteContentMutation>
                  {deleteContent =>
                    loading ? (
                      <div className="mt5 flex justify-center">
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
                        treePath={treePath}
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
