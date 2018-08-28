import moment from 'moment'

export const getFormattedLocalizedDate = (date: string, locale: string) =>
  moment(date)
    .toDate()
    .toLocaleDateString(locale, {
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      year: 'numeric',
    })
