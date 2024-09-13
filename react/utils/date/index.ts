import moment from 'moment'

export const getFirstTime = (date: Date) =>
  moment(date)
    .startOf('day')
    .toDate()

export const getFormattedLocalizedDate = (date: string, locale: string) =>
  moment(date)
    .locale(locale)
    .format("lll")

export const getLastTime = (date: Date) => {
  const dateClone = new Date(date)

  dateClone.setHours(23, 30, 0, 0)

  return dateClone
}

export const getNextDay = (date: Date) => {
  const dateClone = new Date(date)

  dateClone.setDate(date.getDate() + 1)
  dateClone.setHours(0, 0, 0, 0)

  return dateClone
}

export const getNextTime = (date: Date) => {
  const dateClone = new Date(date)

  const hours = dateClone.getHours()
  const minutes = dateClone.getMinutes()

  if (minutes >= 0 && minutes < 30) {
    dateClone.setHours(hours, 30, 0, 0)
  } else {
    dateClone.setHours(hours, 0, 0, 0)

    dateClone.setTime(dateClone.getTime() + 60 * 60 * 1000)
  }

  return dateClone
}

export const getPreviousTime = (date: Date) => {
  const dateClone = new Date(date)

  const hours = dateClone.getHours()
  const minutes = dateClone.getMinutes()

  if (minutes > 0 && minutes <= 30) {
    dateClone.setHours(hours, 0, 0, 0)
  } else {
    dateClone.setHours(hours, 30, 0, 0)

    if (minutes === 0) {
      dateClone.setTime(dateClone.getTime() - 60 * 60 * 1000)
    }
  }

  return dateClone
}

export const isLastTime = (time: Date) =>
  time.getHours() === 23 && time.getMinutes() >= 30

export const isSameDay = (dateA?: Date, dateB?: Date) => {
  if (!dateA || !dateB) {
    return false
  }

  return moment(dateA).isSame(dateB, 'day')
}
