import classnames from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  Button,
  DatePicker,
  IconClose,
  Input,
  RadioGroup,
  ToastConsumerFunctions,
  Toggle,
} from 'vtex.styleguide'

import Modal from '../../../Modal'
import FormFieldSeparator from '../../FormFieldSeparator'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'
import { DeleteRedirectMutationFn, SaveRedirectMutationFn } from './typings'

interface CustomProps {
  initialData: Redirect
  onDelete: DeleteRedirectMutationFn
  onSave: SaveRedirectMutationFn
}

type Props = CustomProps &
  ComponentWithIntlProps &
  RenderContextProps &
  Pick<ToastConsumerFunctions, 'showToast'>

interface State {
  data: Redirect
  isLoading: boolean
  shouldShowDatePicker: boolean
  shouldShowModal: boolean
}

const messages = defineMessages({
  buttonCancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.admin.redirects.form.button.cancel',
  },
  buttonRemove: {
    defaultMessage: 'Remove',
    id: 'admin/pages.admin.redirects.form.button.remove',
  },
  deleteError: {
    defaultMessage: 'Error: redirect could not be deleted.',
    id: 'admin/pages.admin.redirects.form.delete.error',
  },
  from: {
    defaultMessage: 'From',
    id: 'admin/pages.admin.redirects.table.from',
  },
  modalText: {
    defaultMessage: 'Are you sure you want to remove this redirect?',
    id: 'admin/pages.admin.redirects.form.modal.text',
  },
  permanent: {
    defaultMessage: 'This redirect is permanent (Code: 301).',
    id: 'admin/pages.admin.redirects.form.toggle.permanent',
  },
  saveError: {
    defaultMessage: 'Error: redirect could not be saved.',
    id: 'admin/pages.admin.redirects.form.save.error',
  },
  temporary: {
    defaultMessage: 'This redirect is temporary (Code: 302).',
    id: 'admin/pages.admin.redirects.form.toggle.temporary',
  },
  to: {
    defaultMessage: 'To',
    id: 'admin/pages.admin.redirects.table.to',
  },
  toggleEndDate: {
    defaultMessage: 'This redirect has an end date',
    id: 'admin/pages.admin.redirects.form.toggle.endDate',
  },
})

class Form extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
  }

  private isEditingRedirect: boolean
  private minDate = new Date()

  public constructor(props: Props) {
    super(props)

    this.isEditingRedirect = props.initialData.id !== NEW_REDIRECT_ID

    this.state = {
      data: props.initialData,
      isLoading: false,
      shouldShowDatePicker: !!props.initialData.endDate,
      shouldShowModal: false,
    }
  }

  public componentDidMount() {
    window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
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
          onClickCancel={this.handleModalVisibilityToggle}
          onClose={this.handleModalVisibilityToggle}
          textButtonAction={intl.formatMessage(messages.buttonRemove)}
          textButtonCancel={intl.formatMessage(messages.buttonCancel)}
          textMessage={intl.formatMessage(messages.modalText)}
        />
        <h1>
          {this.isEditingRedirect ? (
            <FormattedMessage
              id="admin/pages.admin.redirects.form.title.info"
              defaultMessage="Redirect info"
            />
          ) : (
            <FormattedMessage
              id="admin/pages.admin.redirects.form.title.new"
              defaultMessage="Create a redirect"
            />
          )}
        </h1>
        <FormFieldSeparator />
        <form onSubmit={this.handleSave}>
          <Input
            label={intl.formatMessage(messages.from)}
            onChange={this.handleFromUpdate}
            required
            value={data.from}
          />
          <FormFieldSeparator />
          <Input
            label={intl.formatMessage(messages.to)}
            onChange={this.handleToUpdate}
            required
            value={data.to}
          />
          <FormFieldSeparator />
          <RadioGroup
            name="type"
            options={[
              {
                label: intl.formatMessage(messages.permanent),
                value: 'permanent',
              },
              {
                label: intl.formatMessage(messages.temporary),
                value: 'temporary',
              },
            ]}
            value={data.type}
            onChange={this.handleTypeChange}
          />
          <FormFieldSeparator />
          {data.type === 'temporary' ? (
            <>
              <div className="relative">
                <Toggle
                  checked={shouldShowDatePicker}
                  label={intl.formatMessage(messages.toggleEndDate)}
                  onChange={this.handleDatePickerVisibilityToggle}
                />
              </div>
              <FormFieldSeparator />
              {shouldShowDatePicker && (
                <Fragment>
                  <FormattedMessage id="admin/pages.admin.redirects.form.datePicker.title">
                    {text => <div className="mb3 w-100 f6">{text}</div>}
                  </FormattedMessage>
                  <div className="flex">
                    <DatePicker
                      useTime
                      direction="up"
                      locale={locale}
                      onChange={this.handleEndDateUpdate}
                      minDate={this.minDate}
                      value={
                        data.endDate ? moment(data.endDate).toDate() : undefined
                      }
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center bn input-reset near-black"
                      onClick={this.handleEndDateClear}
                    >
                      <IconClose />
                    </button>
                  </div>
                  <FormFieldSeparator />
                </Fragment>
              )}
            </>
          ) : null}
          <div
            className={classnames('justify-between', {
              flex: this.isEditingRedirect,
            })}
          >
            {this.isEditingRedirect ? (
              <Button
                size="small"
                onClick={this.handleModalVisibilityToggle}
                variation="danger"
              >
                <FormattedMessage
                  id="admin/pages.admin.redirects.form.button.remove"
                  defaultMessage="Remove"
                />
              </Button>
            ) : null}
            <div className="flex justify-end">
              <div className="mr6">
                <Button
                  disabled={isLoading}
                  onClick={this.handleExit}
                  size="small"
                  variation="tertiary"
                >
                  {this.isEditingRedirect ? (
                    <FormattedMessage
                      id="admin/pages.admin.redirects.form.button.back"
                      defaultMessage="Back"
                    />
                  ) : (
                    <FormattedMessage
                      id="admin/pages.admin.redirects.form.button.cancel"
                      defaultMessage="Cancel"
                    />
                  )}
                </Button>
              </div>
              <Button isLoading={isLoading} size="small" type="submit">
                <FormattedMessage
                  id="admin/pages.admin.redirects.form.button.save"
                  defaultMessage="Save"
                />
              </Button>
            </div>
          </div>
        </form>
      </Fragment>
    )
  }

  private handleExit = () => {
    this.props.runtime.navigate({ to: BASE_URL })
  }

  private handleDelete = (redirectId: string) => () => {
    const { intl, onDelete } = this.props

    this.setState({ isLoading: true }, async () => {
      try {
        await onDelete({
          variables: {
            id: redirectId,
          },
        })

        this.handleExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.error(err)

          this.props.showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(messages.deleteError),
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
    const { intl, onSave } = this.props
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
            id:
              this.props.initialData.id !== NEW_REDIRECT_ID
                ? this.props.initialData.id
                : undefined,
            to,
            type,
          },
        })

        this.handleExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.error(err)

          this.props.showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(messages.saveError),
          })
        })
      }
    })
  }

  private handleDatePickerVisibilityToggle = () => {
    this.setState(
      prevState => ({
        ...prevState,
        shouldShowDatePicker: !prevState.shouldShowDatePicker,
      }),
      () => {
        this.handleInputChange({
          endDate: this.state.shouldShowDatePicker
            ? moment(this.props.initialData.endDate || undefined).add(1, 'days')
            : '',
        })
      }
    )
  }

  private handleModalVisibilityToggle = () => {
    this.setState(prevState => ({
      ...prevState,
      shouldShowModal: !prevState.shouldShowModal,
    }))
  }

  private handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    this.handleInputChange({
      ...(type === 'permanent' ? { endDate: '' } : null),
      type,
    })
  }

  private handleEndDateUpdate = (value: Date) => {
    this.handleInputChange({ endDate: value })
  }

  private handleEndDateClear = () => {
    this.handleInputChange({ endDate: '' })
  }

  private handleFromUpdate = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleInputChange({ from: event.target.value })
    }
  }

  private handleToUpdate = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.handleInputChange({ to: event.target.value })
    }
  }
}

export default withRuntimeContext(injectIntl(Form))
