import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { AjvError, ErrorListProps } from 'react-jsonschema-form'
import { Alert } from 'vtex.styleguide'

interface State {
  isVisible: boolean
}

class ErrorListTemplate extends Component<ErrorListProps, State> {
  public static defaultProps = {
    errors: [],
  }

  public static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.object),
  }

  constructor(props: ErrorListProps) {
    super(props)

    this.state = {
      isVisible: true,
    }
  }

  public componentDidUpdate(prevProps: ErrorListProps) {
    const { errors: prevErrors } = prevProps
    const { errors: currErrors } = this.props
    const { isVisible } = this.state

    const haveErrorsChanged =
      currErrors.length !== prevErrors.length ||
      (currErrors.length > 0 &&
        currErrors.reduce<boolean>(
          (acc, error, index) => error.stack !== prevErrors[index].stack || acc,
          false
        ))

    if (!isVisible && haveErrorsChanged) {
      this.setState({ isVisible: true })
    }
  }

  public render() {
    const { errors } = this.props
    const { isVisible } = this.state

    const container = document.getElementById(
      'form__error-list-template___alert'
    )

    return (
      container &&
      createPortal(
        errors.length > 0 && isVisible && (
          <div className="w-100 z-max">
            <Alert onClose={this.handleHide} type="error">
              {errors.length > 1
                ? `There are ${errors.length} invalid inputs.`
                : this.getErrorMessage(errors[0])}
            </Alert>
          </div>
        ),
        container
      )
    )
  }

  private getErrorMessage(error: AjvError) {
    const { message, property } = error

    return `${this.getFormattedFieldName(property)} ${message}`
  }

  private getFormattedFieldName(fieldName: string) {
    return (
      fieldName.charAt(1).toUpperCase() +
      fieldName.slice(2).replace(/([a-z])([A-Z])/g, '$1 $2')
    )
  }

  private handleHide = () => {
    this.setState({ isVisible: false })
  }
}

const StatelessErrorListTemplate: React.FunctionComponent<
  ErrorListProps
> = props => <ErrorListTemplate {...props} />

export default StatelessErrorListTemplate
