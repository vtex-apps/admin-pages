import React from 'react'
import { defineMessages, useIntl } from 'react-intl'

import Tag from './Tag'

const messages = defineMessages({
  from: {
    defaultMessage: 'Start:',
    id: 'admin/pages.editor.configuration.condition.date.from',
  },
  to: {
    defaultMessage: 'End:',
    id: 'admin/pages.editor.configuration.condition.date.to',
  },
})

interface Props {
  conditions: ExtensionConfiguration['condition']['statements']
}

const ConditionTags: React.FC<Props> = ({ conditions }) => {
  const intl = useIntl()

  const format = React.useCallback(
    ({ kind, value }: { kind: ConditionSubject; value: string }) => {
      const textByKind: Record<ConditionSubject, string> = {
        date: `${intl.formatDate(value, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })} ${intl.formatTime(value)}`,
        // TODO
        utm: '',
      }

      return textByKind[kind]
    },
    [intl]
  )

  return (
    <div className="mt5">
      {conditions.map(item => {
        const parsedConditionObj: Record<string, string> = JSON.parse(
          item.objectJSON
        )

        if (!parsedConditionObj) {
          return null
        }

        return Object.entries(parsedConditionObj).reduce<JSX.Element[]>(
          (acc, [key, value]) => {
            const tagTitle = messages[key as keyof typeof messages]

            if (!tagTitle) {
              return acc
            }

            return [
              ...acc,
              <div className="mt3" key={key}>
                <Tag
                  kind={item.subject}
                  text={format({ kind: item.subject, value })}
                  title={intl.formatMessage({
                    id: tagTitle.id,
                  })}
                />
              </div>,
            ]
          },
          []
        )
      })}
    </div>
  )
}

export default ConditionTags
