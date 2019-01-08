import { equals } from 'ramda'
import React, { Fragment } from 'react'

import StyleCard from './StyleCard'

interface Props {
  onChange: (style: Style) => void
  styles: Style[]
}

const List: React.SFC<Props> = ({ onChange, styles }) =>
  styles
    ? (
      <Fragment>
        {styles.map((style: Style, index) => (
          <StyleCard
            checked={style.selected}
            key={index}
            onChange={onChange}
            style={style}
          />
        ))}
      </Fragment>
    )
    : null

export default List
