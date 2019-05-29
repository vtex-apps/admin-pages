import { ConditionsStatement } from 'vtex.styleguide'

import { DateVerbOptions } from './typings'

const formatDateInfo = (
  dateInfo: { date: Date; to: Date; from: Date },
  verb: DateVerbOptions
) =>
  ({
    between: {
      from: dateInfo.from,
      to: dateInfo.to,
    },
    from: {
      from: dateInfo.date,
    },
    is: {
      from: dateInfo.date,
    },
    to: {
      to: dateInfo.date,
    },
  }[verb])

export const formatStatements = (statements: ConditionsStatement[]) =>
  statements.map(({ object, subject, verb }) => ({
    objectJSON: JSON.stringify(formatDateInfo(object, verb as DateVerbOptions)),
    subject: subject as ConditionSubject,
    verb,
  }))
