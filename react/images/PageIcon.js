import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PageIcon extends Component {
  render() {
    return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='23' height='23'>
      <g className='nc-icon-wrapper' fill='none' stroke='#000' strokeWidth='2'
      strokeMiterlimit='10'>
          <polyline dataCap='butt' points='21,31 21,23 29,23' />
          <polygon strokeLinecap='square' points='21,31 3,31 3,1 29,1 29,23' />
      </g>
    </svg>
    )
  }
}

PageIcon.propTypes = {
  fill: PropTypes.string,
}

export default PageIcon
