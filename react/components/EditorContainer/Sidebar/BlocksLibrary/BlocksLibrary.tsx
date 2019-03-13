import React from 'react'
import BlockCard from './BlockCard'

interface Props {
  availableBlocks: AvailableBlock[]
  handleAdd: (block: AvailableBlock) => void
}

const BlocksLibrary: React.FunctionComponent<Props> = ({
  availableBlocks,
  handleAdd,
}) => {
  return (
    <ul className="flex flex-wrap list pl0">
      {availableBlocks.map(block => (
        <BlockCard block={block} onClick={handleAdd} key={block.id} />
      ))}
    </ul>
  )
}

export default React.memo(BlocksLibrary)
