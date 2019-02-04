import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Alert } from 'vtex.styleguide'

class ErrorAlert extends Component<any, any> {
  public static propTypes = {
    message: PropTypes.string.isRequired,
  }

  public constructor(props: any) {
    super(props)

    this.state = {
      isVisible: true,
    }
  }

  public render() {
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

  private handleHide = () => {
    this.setState({ isVisible: false })
  }
}

export default ErrorAlert
