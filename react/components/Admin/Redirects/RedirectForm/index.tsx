import moment, { Moment } from 'moment'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'render'
import { Button, Input, Toggle } from 'vtex.styleguide'

import DeleteRedirect from '../../../../queries/DeleteRedirect.graphql'
import Redirect from '../../../../queries/Redirect.graphql'
import SaveRedirect from '../../../../queries/SaveRedirect.graphql'
import { getFormattedLocalizedDate } from '../../../../utils/date'

import DatePicker from './DatePicker'
import Separator from './Separator'

interface CustomProps {
  deleteRedirect: (options: { variables: object }) => void
  params: { id?: string }
  redirectQuery: {
    loading: boolean
    redirect?: Redirect
  }
  saveRedirect: (options: object) => object
}

type Props = CustomProps & ReactIntl.InjectedIntlProps & RenderContextProps

interface State {
  formData?: Redirect
  isLoading: boolean
  shouldShowDatePicker: boolean
}

const NEW_REDIRECT_ID = 'new'

class RedirectForm extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  private isViewMode: boolean

  constructor(props: Props) {
    super(props)

    const defaultFormData = {
      cacheId: '',
      disabled: false,
      endDate: '',
      from: '',
      id: NEW_REDIRECT_ID,
      to: '',
    }

    const isNew = props.params.id === NEW_REDIRECT_ID

    this.isViewMode = !isNew

    this.state = {
      formData: isNew ? defaultFormData : undefined,
      isLoading: false,
      shouldShowDatePicker: false,
    }
  }

  public componentDidMount() {
    this.handleLoading()

    this.handleInitialFormData()
  }

  public componentDidUpdate() {
    this.handleLoading()

    this.handleInitialFormData()
  }

  public render() {
    const { locale } = this.context.culture
    const { intl } = this.props
    const { formData, isLoading, shouldShowDatePicker } = this.state

    if (!formData) {
      return (
        <div className="w-80 mw9 mv6 ph6 mr-auto ml-auto">
          <span>Loading...</span>
        </div>
      )
    }

    return (
      <div className="w-80 mw9 mv6 ph6 mr-auto ml-auto">
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
            value={formData.from}
          />
          <Separator />
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.to',
            })}
            onChange={this.updateTo}
            required
            value={formData.to}
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
                  value={getFormattedLocalizedDate(formData.endDate, locale)}
                />
              ) : (
                <Fragment>
                  <FormattedMessage id="pages.admin.redirects.form.datePicker.title">
                    {text => <div className="mb3 w-100 f6">{text}</div>}
                  </FormattedMessage>
                  <DatePicker
                    locale={locale}
                    onChange={this.updateEndDate}
                    selected={
                      formData.endDate ? moment(formData.endDate) : undefined
                    }
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
                onClick={this.exit}
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
                onClick={this.handleDelete(formData.id)}
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
      </div>
    )
  }

  private exit = () => {
    const { navigate } = this.props.runtime

    navigate({ to: '/admin/cms/redirects' })
  }

  private handleDelete = (redirectId: string) => async () => {
    const { deleteRedirect } = this.props

    this.setState({ isLoading: true })

    try {
      const data = await deleteRedirect({
        variables: {
          id: redirectId,
        },
      })

      console.log('OK!', data)

      this.exit()
    } catch (err) {
      // alert('Error removing page redirect configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private handleInitialFormData = () => {
    const { redirectQuery } = this.props
    const { formData } = this.state

    if (!formData && !redirectQuery.loading && redirectQuery.redirect) {
      this.setState({ formData: redirectQuery.redirect })
    }
  }

  private handleLoading = () => {
    const { redirectQuery } = this.props

    if (redirectQuery && redirectQuery.loading) {
      this.context.startLoading()
    } else {
      this.context.stopLoading()
    }
  }

  private handleInputChange = (inputData: any) => {
    this.setState(prevState => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        ...inputData,
      },
    }))
  }

  private handleSave = async (event: React.FormEvent) => {
    const { saveRedirect } = this.props

    const { endDate, from, to } = this.state.formData!

    event.preventDefault()

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

      this.exit()
    } catch (err) {
      // alert('Error saving page configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private updateEndDate = (value: Moment) => {
    this.handleInputChange({ endDate: value.utc().format() })
  }

  private updateFrom = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleInputChange({ from: event.target.value })
    }
  }

  private updateTo = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleInputChange({ to: event.target.value })
    }
  }

  private toggleDatePickerVisibility = () => {
    this.setState(
      prevState => ({
        ...prevState,
        shouldShowDatePicker: !prevState.shouldShowDatePicker,
      }),
      () => {
        this.handleInputChange({
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
  graphql(Redirect, {
    name: 'redirectQuery',
    options: ({ params }: Props) => ({
      variables: {
        id: params.id,
      },
    }),
    skip: ({ params }: Props) => params.id === NEW_REDIRECT_ID,
  }),
  graphql(SaveRedirect, {
    name: 'saveRedirect',
  }),
  injectIntl,
  withRuntimeContext,
)(RedirectForm)
