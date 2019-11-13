import React from 'react'
import { createKeydownFromClick } from 'keydown-from-click'

import IconPhone from '../icons/IconPhone'
import IconDesktop from '../icons/IconDesktop'
import IconTablet from '../icons/IconTablet'
import { useHover } from '../hooks'

import { BORDER_BY_POSITION } from './consts'

interface Props {
  isActive: boolean
  onClick: (e: Pick<React.MouseEvent, 'currentTarget'>) => void
  position: keyof typeof BORDER_BY_POSITION
  type: Viewport
}

const Icons = {
  mobile: IconPhone,
  desktop: IconDesktop,
  tablet: IconTablet,
}

const DeviceItem: React.FC<Props> = ({ onClick, position, isActive, type }) => {
  const handleKeyDown = createKeydownFromClick(onClick)

  const { handleMouseEnter, handleMouseLeave, hover } = useHover()

  const Icon = Icons[type]

  return (
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
  )
}

export default DeviceItem
