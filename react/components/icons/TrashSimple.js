import React from 'react'
import PropTypes from 'prop-types'
import { calcIconSize } from './utils'

const iconBase = {
  width: 17,
  height: 18,
}

export default class TrashSimple extends React.Component {
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
        className="editor-icon editor-icon--stroke"
        width={newSize.width}
        height={newSize.height}
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M0 0V7C0 8.105 0.895 9 2 9H10C11.105 9 12 8.105 12 7V0"
          transform="translate(2.5 7.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 0H14"
          transform="translate(1.5 4.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 3V0H4V3"
          transform="translate(6.5 1.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 0V5"
          transform="translate(8.5 8.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 0V5"
          transform="translate(11.5 8.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 0V5"
          transform="translate(5.5 8.5)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
}
