import React from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'

import { getIframeRenderComponents } from '../../../../utils/components'
import { useEditorContext } from '../../../EditorContext'

import {
  getComponents,
  getNormalizedBlocks,
  getTitleByTreePathMap,
} from './utils'

import BlockList from './BlockList'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  updateHighlightTitleByTreePath: (
    titleByTreePath?: Record<string, { title?: string; isEditable: boolean }>
  ) => void
}

const BlockSelector: React.FunctionComponent<Props & InjectedIntlProps> = ({
  highlightHandler,
  iframeRuntime,
  intl,
  updateHighlightTitleByTreePath,
}) => {
  const [blocks, setBlocks] = React.useState(() =>
    getNormalizedBlocks({
      extensions: iframeRuntime.extensions,
      page: iframeRuntime.page,
    })
  )

  const editor = useEditorContext()

  const path = React.useRef('')

  React.useEffect(() => {
    if (path.current !== iframeRuntime.route.path) {
      const nextComponents = getComponents(
        iframeRuntime.extensions,
        getIframeRenderComponents(),
        iframeRuntime.page
      )

      const nextBlocks = getNormalizedBlocks(nextComponents)

      setBlocks(nextBlocks)

      updateHighlightTitleByTreePath(
        getTitleByTreePathMap(nextComponents, intl)
      )

      editor.setIsLoading(false)
      path.current = iframeRuntime.route.path
    }
  }, [
    editor,
    iframeRuntime.extensions,
    iframeRuntime.page,
    iframeRuntime.route.path,
    intl,
    updateHighlightTitleByTreePath,
  ])

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement | HTMLLIElement>) => {
      const treePath = event.currentTarget.getAttribute('data-tree-path')

      highlightHandler(treePath)
    },
    [highlightHandler]
  )

  const handleMouseLeave = React.useCallback(() => {
    highlightHandler(null)
  }, [highlightHandler])

  return (
    <div className="w-100 absolute h-3em">
      <h3 className="fw5 ph5 pv4 ma0 lh-copy f5 near-black">
        <FormattedMessage id="admin/pages.editor.components.title" />
      </h3>

      <div className="bb bw1 b--light-silver" />

      <BlockList
        blocks={blocks}
        highlightHandler={highlightHandler}
        onMouseEnterBlock={handleMouseEnter}
        onMouseLeaveBlock={handleMouseLeave}
        iframeRuntime={iframeRuntime}
      />
    </div>
  )
}

export default React.memo(injectIntl(BlockSelector))
