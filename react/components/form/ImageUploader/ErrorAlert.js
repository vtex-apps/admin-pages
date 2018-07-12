import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Alert } from 'vtex.styleguide'

class ErrorAlert extends Component {
  constructor() {
    super()

    this.state = {
      isVisible: true,
    }
  }

  handleHide = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { message } = this.props
    const { isVisible } = this.state

    return (
      isVisible && (
        <div className="w-100 mt3">
          <Alert onClose={this.handleHide} type="error">
            {message}
          </Alert>
        </div>
      )
    )
  }
}

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
}

export default ErrorAlert
