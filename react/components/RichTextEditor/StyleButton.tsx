import React from 'react'

interface StyleBtnProps {
  label: string | JSX.Element
  active: boolean
  onToggle: (style: string | null) => void
  style: string | null
}

const StyleButton = ({ active, onToggle, label, style }: StyleBtnProps) => {
  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <div
      className={`f6 pointer mr3 flex flex-row justify-center items-center outline-0 ph3 h2 b--muted-4 br2 ba ${
        active ? 'c-action-primary bg-muted-5' : ''
      }`}
      onMouseDown={handleToggle}
      role="button"
      tabIndex={0}
    >
      {label}
    </div>
  )
}

export default StyleButton
