import moment, { Moment } from 'moment'
import React from 'react'
import ReactDatePicker from 'react-datepicker'

interface Props {
  locale: string
  onChange: (value: Date) => void
  selected?: Date
}

const DatePicker = ({ locale, onChange, selected }: Props) => (
  <ReactDatePicker
    dateFormat={moment.defaultFormat}
    fixedHeight
    inline
    locale={locale}
    maxTime={moment().endOf('day').toDate()}
    minDate={moment().toDate()}
    minTime={
      (moment().isSame(selected, 'day') ? moment() : moment().startOf('day')).toDate()
    }
    onChange={onChange}
    selected={selected || moment().add(1, 'days').toDate()}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    utcOffset={moment().utcOffset() / 60}
  />
)

export default DatePicker
