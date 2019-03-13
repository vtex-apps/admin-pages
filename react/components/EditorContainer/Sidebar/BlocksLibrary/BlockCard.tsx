import React, { useMemo } from 'react'

import styles from './BlockCard.css'

interface CardProps {
  block: AvailableBlock
  onClick: (block: AvailableBlock) => void
}

const BlockCard: React.FunctionComponent<CardProps> = ({ block, onClick }) => {
  const handleAdd = useMemo(() => () => onClick(block), [block.id])

  return (
    <li
      className={`bg-light-silver br2 h4 ma3 relative pointer grow ${
        styles['card-flex-size']
      }`}
      onClick={handleAdd}
      style={{
        flex: '1 0 40%',
      }}
    >
      <span
        className={`absolute bottom-0 f6 overflow-hidden w-100 ${
          styles['card-text-overflow-wrap']
        }`}
        style={{ overflowWrap: 'break-word' }}
      >
        {block.id}
      </span>
    </li>
  )
}

export default React.memo(BlockCard)
