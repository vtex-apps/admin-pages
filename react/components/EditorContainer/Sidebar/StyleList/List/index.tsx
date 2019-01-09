import { equals } from 'ramda'
import React, { Fragment } from 'react'

import StyleCard from './StyleCard'

interface Props {
  onChange: (style: Style) => void
  selectedStyle?: Style
  styles: Style[]
}

const List: React.SFC<Props> = ({ onChange, selectedStyle, styles }) =>
  styles
    ? (
      <Fragment>
        {styles.map((style: Style, index) => (
          <StyleCard
            checked={equals(style, selectedStyle)}
            key={index}
            onChange={onChange}
            style={style}
          />
        ))}
      </Fragment>
    )
    : null

export default List
