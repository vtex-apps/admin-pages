import React, { PureComponent } from 'react'
import { calcIconSize, Dimensions, IconProps } from './utils'

const iconBaseDimensions: Dimensions = {
  height: 24,
  width: 24,
}

class Layout extends PureComponent<IconProps> {
  public static defaultProps = {
    block: false,
    color: 'currentColor',
    size: 16,
  }

  public render() {
    const { color, size, block } = this.props
    const newSize = calcIconSize(iconBaseDimensions, size!)

    return (
      <svg
        className={`${block ? 'db' : ''}`}
        width={newSize.width}
        height={newSize.height}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 9.80133H20.0038"
          stroke={color}
          stroke-width="1.6"
          stroke-miterlimit="10"
        />
        <path
          d="M8.80078 9.80133V18.8702"
          stroke={color}
          stroke-width="1.6"
          stroke-miterlimit="10"
        />
        <path
          d="M20.0038 5H4V18.87H20.0038V5Z"
          stroke={color}
          stroke-width="1.6"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
}

export default Layout
