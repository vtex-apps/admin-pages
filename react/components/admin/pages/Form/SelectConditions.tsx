import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ConditionsProps,
  ConditionsRenderFn,
  ConditionsStatement,
  DatePicker,
  EXPERIMENTAL_Conditions as Conditions,
} from 'vtex.styleguide'
import { ConditionFormsData } from 'pages'

import { messages } from './messages'

interface ComponentProps {
  condition: ConditionFormsData
  errorMessage?: string
  operator: ConditionsProps['operator']
  onChangeOperator: ConditionsProps['onChangeOperator']
  onChangeStatements: (statements: ConditionsStatement[]) => void
}

type Props = ComponentProps & RenderContextProps & ComponentWithIntlProps

class SelectConditions extends React.Component<Props> {
  private options: ConditionsProps['options']
  private labels: ConditionsProps['labels']

  public constructor(props: Props) {
    super(props)

    const intl = props.intl

    this.labels = {
      addConditionBtn: intl.formatMessage(messages.addCondition),
      addNewCondition: intl.formatMessage(messages.addCondition),
      delete: intl.formatMessage(messages.delete),
      headerPrefix: intl.formatMessage(messages.headerPrefix),
      headerSufix: intl.formatMessage(messages.headerSuffix),
      noConditions: intl.formatMessage(messages.noConditions),
      operatorAll: intl.formatMessage(messages.operatorAll),
      operatorAnd: intl.formatMessage(messages.operatorAnd),
      operatorAny: intl.formatMessage(messages.operatorAny),
      operatorOr: intl.formatMessage(messages.operatorOr),
    }

    this.options = {
      date: {
        label: intl.formatMessage(messages.dateLabel),
        unique: true,
        verbs: [
          {
            label: intl.formatMessage(messages.dateEquals),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'is',
          },
          {
            label: intl.formatMessage(messages.dateRange),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerRangeObject,
            },
            value: 'between',
          },
          {
            label: intl.formatMessage(messages.dateTo),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'to',
          },
          {
            label: intl.formatMessage(messages.dateFrom),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'from',
          },
        ],
      },
    }
  }

  public render() {
    return (
      <>
        <Conditions
          labels={this.labels}
          options={this.options}
          subjectPlaceholder={this.props.intl.formatMessage(
            messages.subjectPlaceholder
          )}
          statements={this.props.condition.statements}
          operator={this.props.operator}
          onChangeOperator={this.handleToggleOperator}
          onChangeStatements={statements => {
            this.props.onChangeStatements(
              statements.map(statement => ({
                ...statement,
                objectJSON: JSON.stringify(statement.object || null),
              }))
            )
          }}
        />
        <span className="c-danger t-small mt3 lh-title">
          {this.props.errorMessage}
        </span>
      </>
    )
  }

  private handleToggleOperator: ConditionsProps['onChangeOperator'] = operatorObj => {
    if (typeof this.props.onChangeOperator === 'function') {
      this.props.onChangeOperator(operatorObj)
    }
  }

  private complexDatePickerObject: ConditionsRenderFn = ({
    statements,
    values,
    statementIndex,
  }) => {
    const {
      culture: { locale },
    } = this.props.runtime
    return (
      <DatePicker
        value={values && values.date}
        onChange={(date: Date) => {
          const newStatements = statements.map((statement, index) => {
            const dateAtMidnight = new Date(date)
            dateAtMidnight.setHours(0, 0, 0, 0)

            return {
              ...statement,
              object:
                index === statementIndex
                  ? { date: dateAtMidnight }
                  : statement.object,
            }
          })
          this.props.onChangeStatements(newStatements)
        }}
        locale={locale}
      />
    )
  }

  private complexDatePickerRangeObject: ConditionsRenderFn = ({
    statements,
    values,
    statementIndex,
  }) => {
    const {
      culture: { locale },
    } = this.props.runtime
    return (
      <div className="flex">
        <div style={{ maxWidth: 140 }}>
          <DatePicker
            value={values && values.from}
            onChange={(date: Date) => {
              const newStatements = statements.map((statement, index) => {
                return {
                  ...statement,
                  object: {
                    ...statement.object,
                    ...(index === statementIndex ? { from: date } : null),
                  },
                }
              })
              this.props.onChangeStatements(newStatements)
            }}
            locale={locale}
          />
        </div>

        <FormattedMessage
          id="admin/pages.admin.pages.form.templates.simple.conditions.date.range.and"
          defaultMessage="and"
        >
          {message => <div className="mv4 mh3 c-muted-2 b">{message}</div>}
        </FormattedMessage>

        <div style={{ maxWidth: 140 }}>
          <DatePicker
            value={values && values.to}
            onChange={(date: Date) => {
              const newStatements = statements.map((statement, index) => {
                return {
                  ...statement,
                  object: {
                    ...statement.object,
                    ...(index === statementIndex ? { to: date } : null),
                  },
                }
              })
              this.props.onChangeStatements(newStatements)
            }}
            locale={locale}
          />
        </div>
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(SelectConditions))
