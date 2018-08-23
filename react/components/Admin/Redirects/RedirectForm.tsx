import moment, { Moment } from 'moment'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import DatePicker from 'react-datepicker'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Checkbox, Input } from 'vtex.styleguide'

import SavePageRedirect from '../../../queries/SavePageRedirect.graphql'

import Separator from './Separator'

interface CustomProps {
  closeForm: () => void
  onInputChange: (data: object) => void
  redirectInfo: Redirect
  savePageRedirect: (options: object) => object
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  isEndless: boolean
}

class RedirectModal extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.object,
  }

  constructor(props: Props) {
    super(props)

    this.state = { isEndless: true }
  }

  public render() {
    const {
      culture: { locale },
    } = this.context

    const {
      closeForm,
      intl,
      redirectInfo,
      redirectInfo: { active, fromUrl, toUrl },
    } = this.props

    const { isEndless } = this.state

    const endDate = redirectInfo.endDate
      ? moment(redirectInfo.endDate)
      : moment(moment()).add(1, 'days')

    return (
      <div>
        <FormattedMessage id="pages.admin.redirects.newRedirect">
          {text => <h1>{text}</h1>}
        </FormattedMessage>
        <Separator />
        <form onSubmit={this.handleSave}>
          <Input
            label={intl.formatMessage({
              id: 'pages.admin.redirects.info.from',
            })}
            onChange={(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.props.onInputChange({ fromUrl: event.target.value })
              }
            }}
            value={fromUrl}
          />
          <Separator />
          <Input
            label={intl.formatMessage({
              id: 'pages.admin.redirects.info.to',
            })}
            onChange={(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.props.onInputChange({ toUrl: event.target.value })
              }
            }}
            value={toUrl}
          />
          <Separator />
          <Checkbox
            checked={isEndless}
            id="isEndless"
            label={intl.formatMessage({
              id: 'pages.admin.redirects.info.noEndDate',
            })}
            name="isEndless-checkbox-group"
            onChange={this.handleIsEndlessToggle}
            size="small"
            value="isEndless"
          />
          {!isEndless && (
            <Fragment>
              <Separator />
              <FormattedMessage id="pages.admin.redirects.info.endDate">
                {text => <div className="mb3 w-100 f6">{text}</div>}
              </FormattedMessage>
              <DatePicker
                dateFormat="L — LT"
                inline
                fixedHeight
                locale={locale}
                maxTime={moment().endOf('day')}
                minDate={moment()}
                minTime={
                  endDate && moment().isSame(endDate, 'day')
                    ? moment()
                    : moment().startOf('day')
                }
                onChange={(date: Moment) => {
                  this.props.onInputChange({ endDate: date.utc().format() })
                }}
                selected={endDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                utcOffset={-3}
              />
            </Fragment>
          )}
          <Separator />
          <Checkbox
            checked={active}
            id="active"
            label={intl.formatMessage({
              id: 'pages.admin.redirects.info.active',
            })}
            name="active-checkbox-group"
            onChange={(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.props.onInputChange({
                  active: !(event.target.value === 'true'),
                })
              }
            }}
            value="active"
          />
          <Separator />
          <div className="flex justify-end">
            <div className="mr6">
              <Button onClick={closeForm} size="small" variation="tertiary">
                {intl.formatMessage({
                  id: 'pages.admin.redirects.button.cancel',
                })}
              </Button>
            </div>
            <Button size="small" type="submit">
              {intl.formatMessage({
                id: 'pages.admin.redirects.button.save',
              })}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  private handleIsEndlessToggle = () => {
    this.setState(
      prevState => ({
        isEndless: !prevState.isEndless,
      }),
      () => {
        if (this.state.isEndless) {
          this.props.onInputChange({ endDate: null })
        }
      },
    )
  }

  private handleSave = async (event: Event) => {
    event.preventDefault()

    const {
      closeForm,
      redirectInfo: { active, endDate, fromUrl, toUrl },
      savePageRedirect,
    } = this.props

    try {
      const data = await savePageRedirect({
        variables: {
          active,
          endDate,
          fromUrl,
          toUrl,
        },
      })

      console.log('OK!', data)

      closeForm()
    } catch (err) {
      alert('Error saving page configuration.')

      console.log(err)
    }
  }
}

export default compose(
  graphql(SavePageRedirect, {
    name: 'savePageRedirect',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  injectIntl,
)(RedirectModal)
