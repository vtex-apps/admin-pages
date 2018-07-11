import React from 'react'
import PropTypes from 'prop-types'
import { calcIconSize } from './utils'

const iconBase = {
  width: 13,
  height: 14,
}

export default class HitDown extends React.Component {
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
          transform="translate(6.5 1.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 0L5 5L0 0"
          transform="translate(1.5 7.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
}
