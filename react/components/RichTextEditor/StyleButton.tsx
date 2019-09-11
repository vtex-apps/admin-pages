import React from 'react'

import { Tooltip } from 'vtex.styleguide'

interface StyleBtnProps {
  label: string | JSX.Element
  title?: string | JSX.Element
  active: boolean
  onToggle: (style: string | null) => void
  style: string | null
  className?: string
}

const StyleButton = ({
  active,
  onToggle,
  label,
  style,
  className,
  title,
}: StyleBtnProps) => {
  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <Tooltip label={title || 'Label'} position="bottom">
      <div
        className={`f6 pointer mr3 flex flex-row justify-center items-center outline-0 ph3 h2 b--muted-4 br2 ba ${
          active ? 'c-action-primary bg-muted-5' : ''
        } ${className || ''}`}
        onMouseDown={handleToggle}
        role="button"
        tabIndex={0}
      >
        {label}
      </div>
    </Tooltip>
  )
}

export default StyleButton
