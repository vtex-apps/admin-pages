import { createKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'vtex.styleguide'

import { useHover } from '../hooks'
import { BORDER_BY_POSITION, ICON_BY_VIEWPORT } from './consts'
import messages from './messages'

interface Props {
  isActive: boolean
  onClick: (e: Pick<React.MouseEvent, 'currentTarget'>) => void
  position: keyof typeof BORDER_BY_POSITION
  type: Viewport
}

const DeviceItem: React.FC<Props> = ({ onClick, position, isActive, type }) => {
  const handleKeyDown = createKeydownFromClick(onClick)

  const { handleMouseEnter, handleMouseLeave, hover } = useHover()
  const intl = useIntl()

  const Icon = ICON_BY_VIEWPORT[type]

  return (
    <Tooltip label={intl.formatMessage(messages[type])} position="bottom">
      <button
        className={`w2 h2 pointer flex justify-center items-center bg-white outline-0 ${
          isActive || hover ? 'c-action-primary' : 'c-on-disabled'
        } ${BORDER_BY_POSITION[position]}`}
        data-type={type}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon />
      </button>
    </Tooltip>
  )
}

export default DeviceItem
