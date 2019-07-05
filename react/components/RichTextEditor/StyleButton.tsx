import * as React from 'react'

interface StyleBtnProps {
  label: string | JSX.Element
  active: boolean
  onToggle: (style: any) => void
  style: any
}

const StyleButton = ({ active, onToggle, style, label }: StyleBtnProps) => {
  const handleToggle = (e: any) => {
    e.preventDefault()
    onToggle(style)
  }

  return (
    <span className={`f6 pointer mr3 ${active ? 'blue b' : ''}`} onMouseDown={handleToggle}>
      {label}
    </span>
  )
}

export default StyleButton