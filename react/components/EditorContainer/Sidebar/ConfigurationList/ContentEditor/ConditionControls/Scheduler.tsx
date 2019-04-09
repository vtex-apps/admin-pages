import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { DatePicker, Toggle } from 'vtex.styleguide'

import {
  getFirstTime,
  getLastTime,
  getNextDay,
  getNextTime,
  getPreviousTime,
  isLastTime,
  isSameDay,
} from '../../../../../../utils/date'

import ConditionTitle from './ConditionTitle'
import Typings from './typings'

interface CustomProps {
  initialValues?: Typings.DateRange
  updateCondition: (dates: Typings.DateRange) => void
}

type Props = CustomProps & InjectedIntlProps & RenderContextProps

interface State extends Typings.DateRange {
  fromMinTime: Date
  shouldDisplayFrom: boolean
  shouldDisplayTo: boolean
  toMinTime: Date
}

class Scheduler extends Component<Props, State> {
  private currDate: Date
  private defaultMaxTime: Date
  private defaultMinTime: Date
  private minDate: Date

  private initialState: State

  constructor(props: Props) {
    super(props)

    this.currDate = new Date()

    this.defaultMaxTime = getLastTime(this.currDate)
    this.defaultMinTime = getFirstTime(this.currDate)

    const initialTimeLimit = this.currDate

    this.minDate = isLastTime(initialTimeLimit)
      ? getNextDay(this.currDate)
      : this.currDate

    const fromMinTime = getNextTime(initialTimeLimit)
    const toMinTime = getNextTime(fromMinTime)

    const from = props.initialValues && props.initialValues.from
    const to = props.initialValues && props.initialValues.to

    this.initialState = {
      from,
      fromMinTime,
      shouldDisplayFrom: !!from,
      shouldDisplayTo: !!to,
      to,
      toMinTime,
    }

    this.state = this.initialState
  }

  public render() {
    const { intl, runtime: iframeRuntime } = this.props

    return (
      <>
        <ConditionTitle labelId="pages.editor.components.condition.date.title" />

        <Toggle
          checked={this.state.shouldDisplayFrom}
          label={intl.formatMessage({
            id: 'pages.editor.components.condition.date.toggle.start',
          })}
          onChange={this.toggleFromVisibility}
        />

        {this.state.shouldDisplayFrom && (
          <div className="flex mt4">
            <DatePicker
              align="right"
              dateRangeStart={this.state.from}
              dateRangeEnd={this.state.to}
              direction="up"
              isRangeStart
              locale={iframeRuntime.culture.locale}
              maxTime={this.defaultMaxTime}
              minDate={this.minDate}
              minTime={this.state.fromMinTime}
              onChange={this.handleFromChange}
              useTime
              value={this.state.from}
            />
          </div>
        )}

        <div className="mt6" />

        <Toggle
          checked={this.state.shouldDisplayTo}
          label={intl.formatMessage({
            id: 'pages.editor.components.condition.date.toggle.end',
          })}
          onChange={this.toggleToVisibility}
        />

        {this.state.shouldDisplayTo && (
          <div className="flex mt4">
            <DatePicker
              align="right"
              dateRangeStart={this.state.from}
              dateRangeEnd={this.state.to}
              direction="up"
              isRangeEnd
              locale={iframeRuntime.culture.locale}
              maxTime={this.defaultMaxTime}
              minDate={this.minDate}
              minTime={this.state.toMinTime}
              onChange={this.handleToChange}
              useTime
              value={this.state.to}
            />
          </div>
        )}
      </>
    )
  }

  private handleFromChange = (from: Date) => {
    if (from < this.initialState.fromMinTime) {
      from.setTime(this.initialState.fromMinTime.getTime())
    }

    const to =
      this.state.to && from > this.state.to ? getNextTime(from) : this.state.to

    this.setState(
      {
        from,
        fromMinTime: isSameDay(from, this.currDate)
          ? this.initialState.fromMinTime
          : this.defaultMinTime,
        to,
      },
      () => {
        this.props.updateCondition({ from, to })
      }
    )
  }

  private handleToChange = (to: Date) => {
    const isToToday = isSameDay(to, this.currDate)

    if (to < this.initialState.toMinTime) {
      to.setTime(this.initialState.toMinTime.getTime())
    }

    const from =
      this.state.from && to < this.state.from
        ? getPreviousTime(to)
        : this.state.from

    this.setState(
      {
        from,
        fromMinTime: isSameDay(from, this.currDate)
          ? this.initialState.fromMinTime
          : this.defaultMinTime,
        to,
        toMinTime: isToToday
          ? this.initialState.toMinTime
          : this.defaultMinTime,
      },
      () => {
        this.props.updateCondition({ from, to })
      }
    )
  }

  private toggleFromVisibility = () => {
    if (this.state.from) {
      const from = undefined

      this.setState(
        {
          from,
          shouldDisplayFrom: false,
        },
        () => {
          this.props.updateCondition({ from, to: this.state.to })
        }
      )
    } else {
      this.handleFromChange(this.initialState.fromMinTime)

      this.setState({ shouldDisplayFrom: true })
    }
  }

  private toggleToVisibility = () => {
    if (this.state.to) {
      const to = undefined

      this.setState(
        {
          shouldDisplayTo: false,
          to,
        },
        () => {
          this.props.updateCondition({ from: this.state.from, to })
        }
      )
    } else {
      const initialValue = this.state.from
        ? getNextTime(this.state.from)
        : this.initialState.toMinTime

      this.handleToChange(initialValue)

      this.setState({ shouldDisplayTo: true })
    }
  }
}

export default injectIntl(withRuntimeContext(Scheduler))
