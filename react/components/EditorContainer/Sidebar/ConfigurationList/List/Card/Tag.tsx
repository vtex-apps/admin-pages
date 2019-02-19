import React from 'react'

interface Props {
  bgColor: string
  borderColor: string
  hasBorder: boolean
  text: string
  textColor: string
}

const Tag: React.SFC<Props> = ({
  bgColor,
  borderColor,
  hasBorder,
  text,
  textColor,
}) => (
  <div
    className={`ph4 pv2 dib br4 bg-${bgColor} ${textColor} ba b--${
      hasBorder ? borderColor : bgColor
    }`}
  >
    {text}
  </div>
)

export default Tag
