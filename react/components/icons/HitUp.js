import React from 'react'
import PropTypes from 'prop-types'
import { calcIconSize } from './utils'

const iconBase = {
  width: 13,
  height: 14,
}

export default class HitUp extends React.Component {
  static defaultProps = {
    size: 20,
  }

  static propTypes = {
    size: PropTypes.number,
  }

  render() {
    const { size, ...props } = this.props

    const newSize = calcIconSize(iconBase, size)

    return (
      <svg
        className="editor-icon"
        width={newSize.width}
        height={newSize.height}
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0 0V11"
          transform="translate(6.5 12.5) rotate(180)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 0L5 5L0 0"
          transform="translate(11.5 6.5) rotate(180)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
}
