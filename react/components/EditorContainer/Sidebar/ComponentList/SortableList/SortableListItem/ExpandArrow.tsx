import classnames from 'classnames'
import React from 'react'
import ArrowIcon from '../../../../../icons/ArrowIcon'

import SideItem from './SideItem'

import styles from './ExpandArrow.css'

interface Props {
  hasLeftMargin?: boolean
  isExpanded: boolean
  onClick: () => void
}

const ExpandArrow: React.FunctionComponent<Props> = ({
  hasLeftMargin,
  isExpanded,
  onClick,
}) => (
  <SideItem horizontalPaddingClassName="ph2" isPointer onClick={onClick}>
    <div
      className={classnames(`flex items-center color-inherit`, {
        'pl6 ml2': hasLeftMargin,
      })}
      style={hasLeftMargin ? {} : { marginRight: 3 }}
    >
      <div
        className={classnames('color-inherit', styles['transition'], {
          'rotate-90': isExpanded,
        })}
      >
        <ArrowIcon />
      </div>
    </div>
  </SideItem>
)

export default ExpandArrow
