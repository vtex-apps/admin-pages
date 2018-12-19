import { equals } from 'ramda'
import React, { Component } from 'react'

import StyleCard from './StyleCard'

interface Props {
  styles: Style[]
  currentStyle: Style | undefined
  onChange: (style: Style | undefined) => void
}

export default class List extends Component<Props, {}> {
  public render() {
    const { styles, currentStyle, onChange } = this.props
    return styles ? styles.map((style: Style) => (
      <StyleCard style={style} checked={equals(currentStyle, style)} onChange={onChange}/>
    )) : []
  }
}
