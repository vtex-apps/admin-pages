import { equals } from 'ramda'
import React, { Fragment } from 'react'

import StyleCard from './StyleCard'

interface Props {
  currentStyle?: Style
  onChange: (style?: Style) => void
  styles: Style[]
}

const List: React.SFC<Props> = ({ currentStyle, onChange, styles }) =>
  styles
    ? (
      <Fragment>
        {styles.map((style: Style, index) => (
          <StyleCard
            checked={equals(currentStyle, style)}
            key={index}
            onChange={onChange}
            style={style}
          />
        ))}
      </Fragment>
    )
    : null

export default List
