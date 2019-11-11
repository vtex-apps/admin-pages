import React from 'react'

interface Props {
  colors: string[]
}

const Colors: React.FunctionComponent<Props> = ({ colors }) => (
  <div className="flex ba br2 b--muted-5 bg-muted-5 overflow-hidden">
    {colors.map((color, index) => (
      <div
        key={index}
        className={`w2 h2`}
        style={{
          backgroundColor: color,
        }}
      />
    ))}
  </div>
)

export default Colors
