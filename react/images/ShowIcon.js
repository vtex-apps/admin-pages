import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ShowIcon extends Component {
  render() {
    return (
      <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Artboard-2-Copy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="eye-17" transform="translate(0.000000, 2.000000)" fill="#fff" fillRule="nonzero">
            <path d="M8,12 C11.6,12 14.4,8.9 15.6,7.1 C16.1,6.4 16.1,5.5 15.6,4.8 C14.4,3.1 11.6,0 8,0 C4.4,0 1.6,3.1 0.4,4.9 C-0.1,5.6 -0.1,6.5 0.4,7.1 C1.6,8.9 4.4,12 8,12 Z M8,3 C9.7,3 11,4.3 11,6 C11,7.7 9.7,9 8,9 C6.3,9 5,7.7 5,6 C5,4.3 6.3,3 8,3 Z" id="Shape"></path>
          </g>
        </g>
      </svg>
    )
  }
}

ShowIcon.propTypes = {
  fill: PropTypes.string,
}

export default ShowIcon
