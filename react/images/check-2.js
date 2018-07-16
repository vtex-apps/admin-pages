import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CheckIcon extends Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          d="M14.3,2.3L5,11.6L1.7,8.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4,4C4.5,13.9,4.7,14,5,14s0.5-0.1,0.7-0.3 l10-10c0.4-0.4,0.4-1,0-1.4S14.7,1.9,14.3,2.3z"
          className="nc-icon-wrapper"
          fill={this.props.fill}
        />
      </svg>
    )
  }
}

CheckIcon.propTypes = {
  fill: PropTypes.string,
}

CheckIcon.defaultProps = {
  fill: '#368df7',
}

export default CheckIcon
