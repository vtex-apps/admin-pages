import React, { Component } from 'react'
import PropTypes from 'prop-types'

interface IconProps {
  collorFill: string
}

const MobileIcon = ({ collorFill }: IconProps) => (
  <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(12.000000, 10.000000)">
            <rect className={`stroke-${collorFill}`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" x="0.5" y="0.5" width="11" height="15" rx="1"></rect>
            <circle className={`fill-${collorFill}`} fillRule="nonzero" cx="6" cy="12" r="1"></circle>
        </g>
    </g>
  </svg>
)

const DesktopIcon = ({ collorFill }: IconProps) => (
  <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(10.000000, 9.000000)" className={`stroke-${collorFill}`} strokeWidth="1.4">
            <path d="M4.5,15.5 L11.5,15.5"></path>
            <rect x="0.5" y="0.5" width="15" height="12"></rect>
        </g>
    </g>
  </svg>
)

const AllDevicesIcon = ({ collorFill }: IconProps) => (
  <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(1.000000, 10.000000)">
            <g>
                <rect className={`stroke-${collorFill}`} strokeWidth="1.4" stroke-linecap="round" strokeLinejoin="round" x="0.5" y="0.5" width="11" height="15" rx="1"></rect>
                <circle className={`fill-${collorFill}`} fillRule="nonzero" cx="6" cy="12" r="1"></circle>
            </g>
            <g id="tv-2" transform="translate(18.000000, 0.000000)" className={`stroke-${collorFill}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
                <path d="M4.5,15.5 L11.5,15.5" ></path>
                <rect x="0.5" y="0.5" width="15" height="12"></rect>
            </g>
        </g>
    </g>
</svg>
)

class LayoutSwitcher extends Component {
  public static propTypes = {
    activeLayout: PropTypes.string,
    onSwitch: PropTypes.func,
  }
  
  state = {
    selectedDevice: 'desktop',
    hoverDevice: 'desktop'
  }
  
  public handleClick = ({ currentTarget: { id } }) => {
    this.setState({ selectedDevice: id })
  }

  public handleMouseEnter = ({ target: { id } }) => {
    this.setState({ hoverDevice: id })
  }

  public handleMouseLeave = () => {
    this.setState({ hoverDevice: '' })
  }
  
  public render() {
    const { selectedDevice, hoverDevice } = this.state
    return (
      <div className="flex justify-around w-100 bt b--light-silver">
        <div id="all"
          className={`pointer flex justify-center pv3 w-20 bw1 bt ${selectedDevice === 'all' ? 'b--blue' : 'b--transparent'}`}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
          <AllDevicesIcon collorFill={`${(selectedDevice === 'all' || hoverDevice === 'all') ? 'blue' : 'mid-gray' }`} />
        </div>
        <div id="mobile"
          className={`pointer flex justify-center pv3 w-20 bw1 bt ${selectedDevice === 'mobile' ? 'b--blue' : 'b--transparent'}`}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
          <MobileIcon collorFill={`${(selectedDevice == 'mobile' || hoverDevice === 'mobile') ? 'blue' : 'mid-gray' }`} />
        </div>
        <div id="desktop"
          className={`pointer flex justify-center pv3 w-20 bw1 bt ${selectedDevice === 'desktop' ? 'b--blue' : 'b--transparent'}`}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}>
          <DesktopIcon collorFill={`${(selectedDevice === 'desktop' || hoverDevice === 'desktop') ? 'blue' : 'mid-gray' }`} />
        </div>
      </div>
    )
  }
}

export default LayoutSwitcher
