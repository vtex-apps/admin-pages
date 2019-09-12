import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { useEditorContext } from '../../../../EditorContext'
import { NormalizedBlock } from '../typings'

import BlockListItem from './BlockListItem'

interface CustomProps {
  blocks: NormalizedBlock[]
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  onMouseEnterBlock: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeaveBlock: () => void
}

type Props = CustomProps & InjectedIntlProps

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

        highlightHandler(null)
      }
    },
    [editor, highlightHandler]
  )

  return (
    <ul className="mv0 pl0 overflow-y-auto">
      {blocks.map(block => (
        <BlockListItem
          block={block}
          key={block.treePath}
          onEdit={handleEdit}
          onMouseEnter={onMouseEnterBlock}
          onMouseLeave={onMouseLeaveBlock}
        />
      ))}
    </ul>
  )
}

export default injectIntl(BlockList)
