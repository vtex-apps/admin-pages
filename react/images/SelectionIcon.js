import React, { Component } from 'react'
import PropTypes from 'prop-types'

class SelectionIcon extends Component {
  render() {
    const {
      stroke,
    } = this.props

    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" fill="white"/>
        <path d="M0 0L8.4 2.8L3.73333 3.73333L2.8 8.4L0 0Z" transform="translate(11.5996 11.5996)" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.66667 13.0667H0.933333C0.418133 13.0667 0 12.6485 0 12.1333V0.933333C0 0.418133 0.418133 0 0.933333 0H12.1333C12.6485 0 13.0667 0.418133 13.0667 0.933333V4.66667" transform="translate(5 5)" stroke={stroke} strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
}

SelectionIcon.propTypes = {
  stroke: PropTypes.string,
}

export default SelectionIcon
