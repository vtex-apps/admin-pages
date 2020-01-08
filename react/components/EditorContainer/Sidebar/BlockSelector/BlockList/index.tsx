import React from 'react'

import { useEditorContext } from '../../../../EditorContext'
import { NormalizedBlock } from '../typings'
import BlockListItem from './BlockListItem'

interface Props {
  blocks: NormalizedBlock[]
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterBlock: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeaveBlock: () => void
}

const BlockList: React.FC<Props> = ({
  blocks,
  highlightHandler,
  onMouseEnterBlock,
  onMouseLeaveBlock,
}) => {
  const editor = useEditorContext()

  const handleEdit = React.useCallback(
    (block: NormalizedBlock) => {
      if (block.isEditable) {
        editor.editExtensionPoint(block.treePath)

        editor.setIsLoading(true)

        highlightHandler(null)
      }
    },
    [editor, highlightHandler]
  )

  return (
    <ul className="mv0 pl0 overflow-y-auto">
      {blocks.map((block, index) => (
        <BlockListItem
          block={block}
          key={`${block.treePath}-${index}`}
          onEdit={handleEdit}
          onMouseEnter={onMouseEnterBlock}
          onMouseLeave={onMouseLeaveBlock}
        />
      ))}
    </ul>
  )
}

export default BlockList
