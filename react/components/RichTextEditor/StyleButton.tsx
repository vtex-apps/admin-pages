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
    <div
      className={`f6 pointer mr3 flex flex-row justify-center items-center w2 h2 b--muted-4 br2 ba ${active ? 'c-action-primary bg-muted-5' : ''}`}
      onMouseDown={handleToggle}
    >
      {label}
    </div>
  )
}

export default StyleButton