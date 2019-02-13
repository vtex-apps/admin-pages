import React from 'react'

interface Props {
  typography: StyleTypography
}

const Typography: React.SFC<Props> = ({
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    textTransform,
    letterSpacing,
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
