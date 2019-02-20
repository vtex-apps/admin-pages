import * as locales from 'date-fns/locale/index'
import moment, { Moment } from 'moment'
import React, { useEffect } from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'

interface Props {
  locale: string
  onChange: (value: Moment) => void
  selected: Date
}

const DatePicker = ({ locale, onChange, selected }: Props) => {
  useEffect(
    () => {
      registerLocale(locale, (locales as any)[locale.replace('-', '')])
    },
    [locale]
  )

  return (
    <ReactDatePicker
      dateFormat={moment.defaultFormat}
      fixedHeight
      inline
      locale={locale}
      maxTime={moment()
        .endOf('day')
        .toDate()}
      minDate={moment().toDate()}
      minTime={(moment().isSame(selected, 'day')
        ? moment()
        : moment().startOf('day')
      ).toDate()}
      onChange={(d: Date) => onChange(moment(d))}
      selected={selected}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
    />
  )
}

export default DatePicker
