import React from 'react'

import { NormalizedBlock } from '../../typings'

import ExpandArrow from './ExpandArrow'
import Item from './Item'

interface Props {
  block: NormalizedBlock
  onEdit: (block: NormalizedBlock) => void
  onMouseEnter: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeave: () => void
}

const BlockListItem: React.FC<Props> = ({
  block,
  onEdit,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleClick = React.useCallback(() => {
    onEdit(block)
  }, [block, onEdit])

  const handleExpansionToggle = React.useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const subitems = block.components || []
  const hasSubitems = subitems.length > 0

  return (
    <>
      <div
        className="flex items-center bb bg-white b--light-silver"
        data-tree-path={block.treePath}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {hasSubitems && (
          <ExpandArrow
            isExpanded={isExpanded}
            onClick={handleExpansionToggle}
          />
        )}

        <Item
          hasSubitems={hasSubitems}
          isEditable={block.isEditable}
          onEdit={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          title={block.name}
          treePath={block.treePath}
        />
      </div>
      {isExpanded && subitems && (
        <div className="mv0 pl0">
          {subitems.map((item, index) => (
            <div
              className="flex bg-white hover-bg-light-silver list"
              data-tree-path={item.treePath}
              key={item.treePath}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="bl bw2 b--light-blue" />

              <div
                className={`w-100 ${
                  index !== subitems.length - 1 ? 'bb b--light-silver ' : ''
                }`}
              >
                <BlockListItem
                  block={item}
                  onEdit={onEdit}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              </div>
            </div>
          ))}

          <div className="bb b--light-silver" />
        </div>
      )}
    </>
  )
}

export default BlockListItem
