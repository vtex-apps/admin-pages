import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import SelectionIcon from '../../../../images/SelectionIcon'
import { useEditorContext } from '../../../EditorContext'

import { getNormalizedBlocks } from './utils'

import BlockList from './BlockList'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
}

const BlockSelector: React.FunctionComponent<Props> = ({
  highlightHandler,
  iframeRuntime,
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
      setBlocks(
        getNormalizedBlocks({
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

  const handleEditModeToggle = editor.toggleEditMode

  const handleKeyPress = useKeydownFromClick(handleEditModeToggle)

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
    <div className="w-100 absolute">
      <div className="flex justify-between items-center flex-shrink-0 h-3em">
        <h3 className="fw5 ph5 pv4 ma0 lh-copy f5 near-black">
          <FormattedMessage id="admin/pages.editor.components.title" />
        </h3>

        <div
          className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn outline-0"
          onClick={handleEditModeToggle}
          onKeyPress={handleKeyPress}
          role="button"
          tabIndex={0}
        >
          <span className="pr5 b--light-gray flex items-center">
            <SelectionIcon stroke={editor.editMode ? '#368df7' : '#979899'} />
          </span>
        </div>
      </div>

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

export default React.memo(BlockSelector)
