import { ConditionsStatement } from 'vtex.styleguide'

import { DateInfo, DateVerbOptions } from './typings'

const formatDateInfo = (dateInfo: DateInfo, verb: DateVerbOptions) =>
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
    objectJSON: JSON.stringify(
      formatDateInfo(object as DateInfo, verb as DateVerbOptions)
    ),
    subject: subject as ConditionSubject,
    verb,
  }))
