import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ShareIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
        <g className="nc-icon-wrapper" fill="#111">
          <path d="M15,0H8v2h4.6L6.3,8.3l1.4,1.4L14,3.4V8h2V1C16,0.4,15.6,0,15,0z" />
          <path d="M14,16H1c-0.6,0-1-0.4-1-1V2c0-0.6,0.4-1,1-1h4v2H2v11h11v-3h2v4C15,15.6,14.6,16,14,16z" />
        </g>
      </svg>
    )
  }
}

ShareIcon.propTypes = {
  fill: PropTypes.string,
}

export default ShareIcon
