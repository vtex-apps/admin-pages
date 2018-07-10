import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ShowIcon extends Component {
  render() {
    return (
      <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
        <g id="Artboard-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
           <g id="eye-17" transform="translate(0.000000, 2.000000)" stroke="#979899" stroke-width="1.4">
               <path d="M0.5,6 C0.5,6 3.5,0.5 8,0.5 C12.5,0.5 15.5,6 15.5,6 C15.5,6 12.5,11.5 8,11.5 C3.5,11.5 0.5,6 0.5,6 Z" id="Shape"></path>
               <circle id="Oval" cx="8" cy="6" r="2.5"></circle>
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
