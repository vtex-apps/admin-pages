import React from 'react'

interface Props {
  colors: StyleColors
}

const Colors: React.SFC<Props> = ({ colors }) => {
  const { action_primary, action_secondary, base, emphasis } = colors

  const colorContainer = (color: string, border?: string) => (
    <div
      className={`w2 h2 ${border ? `br2 br--${border}` : ''}`}
      style={{
        backgroundColor: color,
      }}
    />
  )

  return (
    <div className="w4 flex ba br2 b--muted-5 bg-muted-5">
      {colorContainer(emphasis, 'left')}
      {colorContainer(action_primary)}
      {colorContainer(action_secondary)}
      {colorContainer(base, 'right')}
    </div>
  )
}

export default Colors
