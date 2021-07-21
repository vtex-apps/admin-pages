import classnames from 'classnames'
import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'

import ArrowIcon from '../../../../../../icons/ArrowIcon'
import styles from './styles.css'

interface Props {
  isExpanded: boolean
  onClick: () => void
}

const ExpandArrow: React.FC<Props> = ({ isExpanded, onClick }) => {
  const handleKeyDown = useKeydownFromClick(onClick)

  return (
    <div
      className="flex items-center ph3 pv5 bg-inherit c-muted-3 hover-bg-light-silver hover-black-90 outline-0 pointer"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center ph4 color-inherit">
        <div
          className={classnames('color-inherit', styles.transition, {
            'rotate-90': isExpanded,
          })}
        >
          <ArrowIcon />
        </div>
      </div>
    </div>
  )
}

export default ExpandArrow
