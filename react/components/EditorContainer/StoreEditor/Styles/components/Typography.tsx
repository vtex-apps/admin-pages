import React from 'react'

interface Props {
  typography: Font
}

const Typography: React.SFC<Props> = ({
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textTransform,
  },
}) => {
  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        textTransform,
      }}
    >
      Aa
    </div>
  )
}

export default Typography
