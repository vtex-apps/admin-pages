import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PathMinus extends Component {
  render() {
    return (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 2V0H2" transform="translate(1 6)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 2.031V0" transform="translate(1 10)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 2H0V0" transform="translate(1 14)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 0H0" transform="translate(5 16)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 0V2H0" transform="translate(9 14)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 0V2" transform="translate(11 10)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 0H2V2" transform="translate(9 6)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 0H2" transform="translate(5 6)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 3V0H10V10H7" transform="translate(6 1)" stroke="#727273" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }
}

PathMinus.propTypes = {
  fill: PropTypes.string,
}

export default PathMinus
