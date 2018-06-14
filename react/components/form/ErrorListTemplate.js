import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { Alert } from 'vtex.styleguide'

class ErrorListTemplate extends Component {
  constructor() {
    super()

    this.state = {
      isVisible: true,
    }
  }

  componentDidUpdate(prevProps) {
    const { errors: prevErrors } = prevProps
    const { errors: currErrors } = this.props
    const { isVisible } = this.state

    const haveErrorsChanged =
      currErrors.length !== prevErrors.length ||
      (currErrors.length > 0 &&
        currErrors.reduce(
          (acc, error, index) => error.stack !== prevErrors[index].stack || acc,
          false,
        )
      )

    if (!isVisible && haveErrorsChanged) {
      this.setState({ isVisible: true })
    }
  }

  getErrorMessage(error) {
    const { message, property } = error

    return `${this.getFormattedFieldName(property)} ${message}`
  }

  getFormattedFieldName(fieldName) {
    return (
      fieldName.charAt(1).toUpperCase() +
      fieldName.slice(2).replace(/([a-z])([A-Z])/g, '$1 $2')
    )
  }

  handleHide = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { errors } = this.props
    const { isVisible } = this.state

    return createPortal(
      errors.length > 0 &&
      isVisible && (
        <div className="w-100 z-max">
          <Alert onClose={this.handleHide} type="error">
            {errors.length > 1
              ? `There are ${errors.length} invalid inputs.`
              : this.getErrorMessage(errors[0])}
          </Alert>
        </div>
      ),
      document.getElementById('form__error-list-template___alert')
    )
  }
}

ErrorListTemplate.defaultProps = {
  errors: [],
}

ErrorListTemplate.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
}

export default ErrorListTemplate
