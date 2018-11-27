import React, { PureComponent } from 'react'
import { calcIconSize, Dimensions, IconProps } from './utils'

const iconBaseDimensions: Dimensions = {
  height: 24,
  width: 24,
}

class Content extends PureComponent<IconProps> {
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
          d="M13.4665 18.9997H6V5H18.1331V14.3331L13.4665 18.9997Z"
          stroke={color}
          stroke-width="1.6"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.4668 18.9997V14.3331H18.1334"
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

export default Content
