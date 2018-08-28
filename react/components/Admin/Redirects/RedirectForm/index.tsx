import moment, { Moment } from 'moment'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Input, Toggle } from 'vtex.styleguide'

import DeleteRedirect from '../../../../queries/DeleteRedirect.graphql'
import SaveRedirect from '../../../../queries/SaveRedirect.graphql'
import { getFormattedLocalizedDate } from '../../../../utils/date'

import DatePicker from './DatePicker'
import Separator from './Separator'

interface CustomProps {
  closeForm: () => void
  deleteRedirect: (options: { variables: object }) => void
  onInputChange: (data: object) => void
  redirectInfo: Redirect
  saveRedirect: (options: object) => object
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  isLoading: boolean
  shouldShowDatePicker: boolean
}

class RedirectForm extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
  }

  private isViewMode: boolean

  constructor(props: Props) {
    super(props)

    this.isViewMode = props.redirectInfo.id !== 'new'

    this.state = {
      isLoading: false,
      shouldShowDatePicker: !!props.redirectInfo.endDate,
    }
  }

  public render() {
    const {
      closeForm,
      intl,
      redirectInfo,
      redirectInfo: { endDate, from, to },
    } = this.props

    const { isLoading, shouldShowDatePicker } = this.state

    const { locale } = this.context.culture

    return (
      <Fragment>
        <FormattedMessage
          id={
            this.isViewMode
              ? 'pages.admin.redirects.form.title.info'
              : 'pages.admin.redirects.form.title.new'
          }
        >
          {text => <h1>{text}</h1>}
        </FormattedMessage>
        <Separator />
        <form onSubmit={this.handleSave}>
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.from',
            })}
            onChange={this.updateFrom}
            required
            value={from}
          />
          <Separator />
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.to',
            })}
            onChange={this.updateTo}
            required
            value={to}
          />
          <Separator />
          <Toggle
            checked={shouldShowDatePicker}
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.form.toggle.endDate',
            })}
            onChange={this.toggleDatePickerVisibility}
            size="small"
          />
          <Separator />
          {shouldShowDatePicker && (
            <Fragment>
              {this.isViewMode ? (
                <Input
                  disabled
                  label={intl.formatMessage({
                    id: 'pages.admin.redirects.form.datePicker.title',
                  })}
                  value={getFormattedLocalizedDate(endDate, locale)}
                />
              ) : (
                <Fragment>
                  <FormattedMessage id="pages.admin.redirects.form.datePicker.title">
                    {text => <div className="mb3 w-100 f6">{text}</div>}
                  </FormattedMessage>
                  <DatePicker
                    locale={locale}
                    onChange={this.updateEndDate}
                    selected={endDate ? moment(endDate) : undefined}
                  />
                </Fragment>
              )}
              <Separator />
            </Fragment>
          )}
          <div className="flex justify-end">
            <div className="mr6">
              <Button
                disabled={isLoading}
                onClick={closeForm}
                size="small"
                variation="tertiary"
              >
                {intl.formatMessage({
                  id: this.isViewMode
                    ? 'pages.admin.redirects.form.button.back'
                    : 'pages.admin.redirects.form.button.cancel',
                })}
              </Button>
            </div>
            {this.isViewMode ? (
              <Button
                isLoading={isLoading}
                size="small"
                onClick={this.handleDelete(redirectInfo.id)}
                variation="danger"
              >
                {intl.formatMessage({
                  id: 'pages.admin.redirects.form.button.delete',
                })}
              </Button>
            ) : (
              <Button isLoading={isLoading} size="small" type="submit">
                {intl.formatMessage({
                  id: 'pages.admin.redirects.form.button.create',
                })}
              </Button>
            )}
          </div>
        </form>
      </Fragment>
    )
  }

  private handleDelete = (redirectId: string) => async () => {
    const { deleteRedirect, closeForm } = this.props

    this.setState({ isLoading: true })

    try {
      const data = await deleteRedirect({
        variables: {
          id: redirectId,
        },
      })

      console.log('OK!', data)

      closeForm()
    } catch (err) {
      // alert('Error removing page redirect configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private handleSave = async () => {
    const {
      closeForm,
      redirectInfo: { endDate, from, to },
      saveRedirect,
    } = this.props

    this.setState({ isLoading: true })

    try {
      const data = await saveRedirect({
        variables: {
          endDate,
          from,
          to,
        },
      })

      console.log('OK!', data)

      closeForm()
    } catch (err) {
      // alert('Error saving page configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private updateEndDate = (value: Moment) => {
    this.props.onInputChange({ endDate: value.utc().format() })
  }

  private updateFrom = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.props.onInputChange({ from: event.target.value })
    }
  }

  private updateTo = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.props.onInputChange({ to: event.target.value })
    }
  }

  private toggleDatePickerVisibility = () => {
    this.setState(
      prevState => ({
        ...prevState,
        shouldShowDatePicker: !prevState.shouldShowDatePicker,
      }),
      () => {
        this.props.onInputChange({
          endDate: this.state.shouldShowDatePicker
            ? moment().add(1, 'days')
            : '',
        })
      },
    )
  }
}

export default compose(
  graphql(DeleteRedirect, {
    name: 'deleteRedirect',
  }),
  graphql(SaveRedirect, {
    name: 'saveRedirect',
  }),
  injectIntl,
)(RedirectForm)
