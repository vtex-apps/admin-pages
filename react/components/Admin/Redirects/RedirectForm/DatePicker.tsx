import moment, { Moment } from 'moment'
import React from 'react'
import ReactDatePicker from 'react-datepicker'

interface Props {
  locale: string
  onChange: (value: Moment) => void
  selected?: Moment
}

const DatePicker = ({ locale, onChange, selected }: Props) => (
  <ReactDatePicker
    dateFormat={moment.defaultFormat}
    fixedHeight
    inline
    locale={locale}
    maxTime={moment().endOf('day')}
    minDate={moment()}
    minTime={
      moment().isSame(selected, 'day') ? moment() : moment().startOf('day')
    }
    onChange={onChange}
    selected={selected || moment().add(1, 'days')}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    utcOffset={moment().utcOffset() / 60}
  />
)

export default DatePicker
