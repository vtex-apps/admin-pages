import React, { Component } from 'react'
import { IconEdit } from 'vtex.styleguide'

import ShowIcon from '../../images/ShowIcon.js'

interface IconsProps {
  colorFill: string
  id: Viewport
}

interface DeviceComponentProps {
  id: Viewport
  key: Viewport
  onClick: (event: any) => void
  selected: boolean
}

interface DeviceComponentState {
  hover: boolean
}

interface DeviceSwitcherProps {
  setViewport: (viewport: Viewport) => void
  toggleEditMode: () => void
  viewports: Viewport[]
  viewport: Viewport
  inPreview: boolean
}

const Icons = ({ id, colorFill }: IconsProps) => {
  switch (id) {
    case 'tablet':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 1C0 0.447715 0.447715 0 1 0H12C12.5523 0 13 0.447715 13 1V14C13 14.5523 12.5523 15 12 15H1C0.447715 15 0 14.5523 0 14V1Z"
            transform="translate(12 11)"
            className={`stroke-${colorFill}`}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z"
            transform="translate(17.5 21.5)"
            className={`fill-${colorFill}`}
          />
        </svg>
      )
    case 'mobile':
      return (
        <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(12.000000, 10.000000)">
              <rect
                className={`stroke-${colorFill}`}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                x="0.5"
                y="0.5"
                width="11"
                height="15"
                rx="1"
              />
              <circle
                className={`fill-${colorFill}`}
                fillRule="nonzero"
                cx="6"
                cy="12"
                r="1"
              />
            </g>
          </g>
        </svg>
      )
    case 'desktop':
      return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" fill="white" />
          <path
            d="M0 0H7"
            transform="translate(15 26.1992)"
            className={`stroke-${colorFill}`}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0H15V12H0V0Z"
            transform="translate(11 11.1992)"
            className={`stroke-${colorFill}`}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

class DeviceComponent extends Component<
  DeviceComponentProps,
  DeviceComponentState
> {
  constructor(props: DeviceComponentProps) {
    super(props)

    this.state = {
      hover: false,
    }
  }

  public handleMouseEnter = () => {
    this.setState({ hover: true })
  }

  public handleMouseLeave = () => {
    this.setState({ hover: false })
  }

  public render() {
    const { id, selected, onClick } = this.props
    const { hover } = this.state

    return (
      <div
        id={id}
        className={`pointer flex justify-center pv3 mh4 w-20 bw1 bt ${
          selected ? 'b--blue' : 'b--transparent'
        }`}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Icons id={id} colorFill={selected || hover ? 'blue' : 'mid-gray'} />
      </div>
    )
  }
}

// tslint:disable-next-line:max-classes-per-file
class DeviceSwitcher extends React.PureComponent<DeviceSwitcherProps> {
  public handleClick = ({ currentTarget }: Event) => {
    const { setViewport } = this.props

    if (currentTarget && currentTarget instanceof HTMLElement) {
      setViewport(currentTarget.id as Viewport)
    }
  }

  public render() {
    const { inPreview, toggleEditMode, viewport, viewports } = this.props
    return (
      <div
        className="flex justify-around w-100 bt-0 b--light-silver"
        style={{
          height: '54px',
          width: `${100 + 70 * viewports.length}px`,
        }}
      >
        <div className="flex justify-center items-center ph3 w-5 draggable">
          <svg width="14" height="36" viewBox="0 0 14 36" fill="none">
            <rect width="14" height="36" fill="white" />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(8 12)"
              fill="#727273"
            />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(8 17)"
              fill="#727273"
            />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(8 22)"
              fill="#727273"
            />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(4 12)"
              fill="#727273"
            />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(4 17)"
              fill="#727273"
            />
            <circle
              cx="1"
              cy="1"
              r="1"
              transform="translate(4 22)"
              fill="#727273"
            />
          </svg>
        </div>
        {viewports.map(id => (
          <DeviceComponent
            id={id}
            key={id}
            onClick={this.handleClick}
            selected={id === viewport}
          />
        ))}
        <div
          className={`${
            viewports.length > 0 ? 'bl-s b--light-gray' : ''
          } flex flex-grow-1 justify-center items-center mid-gray hover-blue mv3 ph3 w-25 pointer`}
          onClick={toggleEditMode}
        >
          {inPreview ? (
            <IconEdit size={16} color="currentColor" solid />
          ) : (
            <ShowIcon />
          )}
        </div>
      </div>
    )
  }
}

export default DeviceSwitcher
