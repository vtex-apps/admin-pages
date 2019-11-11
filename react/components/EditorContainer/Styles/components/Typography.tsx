import React from 'react'

interface Props {
  typography: Font
  textColor?: string
}

const Typography: React.FunctionComponent<Props> = ({
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    textTransform,
  },
  textColor,
}) => {
  return (
    <div
      style={{
        color: textColor || 'black',
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
