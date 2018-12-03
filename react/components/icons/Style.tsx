import React, { PureComponent } from 'react'
import { calcIconSize, Dimensions, IconProps } from './utils'

const iconBaseDimensions: Dimensions = {
  height: 24,
  width: 24,
}

class Style extends PureComponent<IconProps> {
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
      fill="none">
        <path
          d="M18.9998 15.2664C18.9998 15.7614 18.8032 16.2362 18.4531 16.5863C18.1031 16.9363 17.6283 17.133 17.1332 17.133C16.6382 17.133 16.1634 16.9363 15.8133 16.5863C15.4633 16.2362 15.2666 15.7614 15.2666 15.2664C15.2666 14.2397 17.1332 11.5331 17.1332 11.5331C17.1332 11.5331 18.9998 14.2397 18.9998 15.2664Z"
          stroke={color}
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 7V11.6665H12.4665V19.133"
          stroke={color}
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.0659 5H6.86621V8.73323H18.0659V5Z"
          stroke={color}
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
}

export default Style
