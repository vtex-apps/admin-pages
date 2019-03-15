import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { MutationFn } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  Button,
  DatePicker,
  Input,
  RadioGroup,
  ToastConsumerFunctions,
  Toggle,
} from 'vtex.styleguide'

import { getFormattedLocalizedDate } from '../../../../utils/date'
import Modal from '../../../Modal'
import FormFieldSeparator from '../../FormFieldSeparator'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'

interface CustomProps {
  initialData: Redirect
  onDelete: MutationFn
  onSave: MutationFn
}

type Props = CustomProps &
  ReactIntl.InjectedIntlProps &
  RenderContextProps &
  Pick<ToastConsumerFunctions, 'showToast'>

interface State {
  data: Redirect
  isLoading: boolean
  shouldShowDatePicker: boolean
  shouldShowModal: boolean
}

class Form extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  private isViewMode: boolean

  constructor(props: Props) {
    super(props)

    this.isViewMode = props.initialData.id !== NEW_REDIRECT_ID

    this.state = {
      data: props.initialData,
      isLoading: false,
      shouldShowDatePicker: !!props.initialData.endDate,
      shouldShowModal: false,
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public render() {
    const { locale } = this.context.culture
    const { intl } = this.props
    const {
      data,
      isLoading,
      shouldShowModal,
      shouldShowDatePicker,
    } = this.state

    return (
      <Fragment>
        <Modal
          isActionDanger
          isActionLoading={isLoading}
          isOpen={shouldShowModal}
          onClickAction={this.handleDelete(data.id)}
          onClickCancel={this.toggleModalVisibility}
          onClose={this.toggleModalVisibility}
          textButtonAction={intl.formatMessage({
            id: 'pages.admin.redirects.form.button.remove',
          })}
          textButtonCancel={intl.formatMessage({
            id: 'pages.admin.redirects.form.button.cancel',
          })}
          textMessage={intl.formatMessage({
            id: 'pages.admin.redirects.form.modal.text',
          })}
        />
        <FormattedMessage
          id={
            this.isViewMode
              ? 'pages.admin.redirects.form.title.info'
              : 'pages.admin.redirects.form.title.new'
          }
        >
          {text => <h1>{text}</h1>}
        </FormattedMessage>
        <FormFieldSeparator />
        <form onSubmit={this.handleSave}>
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.from',
            })}
            onChange={this.updateFrom}
            required
            value={data.from}
          />
          <FormFieldSeparator />
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.to',
            })}
            onChange={this.updateTo}
            required
            value={data.to}
          />
          <FormFieldSeparator />
          <RadioGroup
            disabled={this.isViewMode}
            name="type"
            options={[
              {
                label: intl.formatMessage({
                  id: 'pages.admin.redirects.form.toggle.permanent',
                }),
                value: 'permanent',
              },
              {
                label: intl.formatMessage({
                  id: 'pages.admin.redirects.form.toggle.temporary',
                }),
                value: 'temporary',
              },
            ]}
            value={data.type}
            onChange={this.changeType}
          />
          <FormFieldSeparator />
          {data.type === 'temporary' ? (
            <>
              <div className="relative">
                <Toggle
                  checked={shouldShowDatePicker}
                  disabled={this.isViewMode}
                  label={intl.formatMessage({
                    id: 'pages.admin.redirects.form.toggle.endDate',
                  })}
                  onChange={this.toggleDatePickerVisibility}
                />
              </div>
              <FormFieldSeparator />
              {shouldShowDatePicker && (
                <Fragment>
                  {this.isViewMode ? (
                    <Input
                      disabled
                      label={intl.formatMessage({
                        id: 'pages.admin.redirects.form.datePicker.title',
                      })}
                      value={getFormattedLocalizedDate(data.endDate, locale)}
                    />
                  ) : (
                    <Fragment>
                      <FormattedMessage id="pages.admin.redirects.form.datePicker.title">
                        {text => <div className="mb3 w-100 f6">{text}</div>}
                      </FormattedMessage>
                      <DatePicker
                        locale={locale}
                        onChange={this.updateEndDate}
                        useTime={true}
                        value={
                          data.endDate
                            ? moment(data.endDate).toDate()
                            : moment()
                                .add(1, 'days')
                                .toDate()
                        }
                      />
                    </Fragment>
                  )}
                  <FormFieldSeparator />
                </Fragment>
              )}
            </>
          ) : null}
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
                size="small"
                onClick={this.toggleModalVisibility}
                variation="danger"
              >
                {intl.formatMessage({
                  id: 'pages.admin.redirects.form.button.remove',
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

  private exit = () => {
    this.props.runtime.navigate({ to: BASE_URL })
  }

  private handleDelete = (redirectId: string) => () => {
    const { onDelete } = this.props

    this.setState({ isLoading: true }, async () => {
      try {
        await onDelete({
          variables: {
            id: redirectId,
          },
        })

        this.exit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          this.props.showToast({
            horizontalPosition: 'right',
            message: 'Error: redirect could not be deleted.',
          })
        })
      }
    })
  }

  private handleInputChange = (inputData: object) => {
    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        ...inputData,
      },
    }))
  }

  private handleSave = (event: React.FormEvent) => {
    const { onSave } = this.props
    const {
      data: { endDate, from, to, type },
    } = this.state

    event.preventDefault()

    this.setState({ isLoading: true }, async () => {
      try {
        await onSave({
          variables: {
            endDate,
            from,
            to,
            type,
          },
        })

        this.exit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          this.props.showToast({
            horizontalPosition: 'right',
            message: 'Error: redirect could not be deleted.',
          })
        })
      }
    })
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
      }
    )
  }

  private toggleModalVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      shouldShowModal: !prevState.shouldShowModal,
    }))
  }

  private changeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    this.handleInputChange({
      ...(type === 'permanent' ? { endDate: '' } : null),
      type,
    })
  }

  private updateEndDate = (value: Date) => {
    this.handleInputChange({ endDate: value })
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
}

export default withRuntimeContext(injectIntl(Form))
