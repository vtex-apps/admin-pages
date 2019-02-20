import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ConditionsProps,
  ConditionsRenderFn,
  ConditionsStatement,
  DatePicker,
  EXPERIMENTAL_Conditions as Conditions,
} from 'vtex.styleguide'

import { ConditionFormsData } from 'pages'

interface ComponentProps {
  condition: ConditionFormsData
  errorMessage?: string
  operator: ConditionsProps['operator']
  onChangeOperator: ConditionsProps['onChangeOperator']
  onChangeStatements: (statements: ConditionsStatement[]) => void
}

type Props = ComponentProps & RenderContextProps & InjectedIntlProps

class SelectConditions extends React.Component<Props> {
  private options: ConditionsProps['options']
  private labels: ConditionsProps['labels']

  constructor(props: Props) {
    super(props)

    const intl = props.intl
    const translate = (id: string) => intl.formatMessage({ id })

    this.labels = {
      addConditionBtn: translate(
        'pages.admin.pages.form.templates.simple.conditions.add-button'
      ),
      addNewCondition: translate(
        'pages.admin.pages.form.templates.simple.conditions.add-button'
      ),
      delete: translate('pages.admin.pages.form.button.delete'),
      headerPrefix: translate(
        'pages.admin.pages.form.templates.simple.conditions.header-prefix'
      ),
      headerSufix: translate(
        'pages.admin.pages.form.templates.simple.conditions.header-suffix'
      ),
      noConditions: translate(
        'pages.admin.pages.form.templates.simple.conditions.no-conditions'
      ),
      operatorAll: translate(
        'pages.admin.pages.form.templates.simple.conditions.operator-all'
      ),
      operatorAnd: translate(
        'pages.admin.pages.form.templates.simple.conditions.operator-and'
      ),
      operatorAny: translate(
        'pages.admin.pages.form.templates.simple.conditions.operator-any'
      ),
      operatorOr: translate(
        'pages.admin.pages.form.templates.simple.conditions.operator-or'
      ),
    }

    this.options = {
      date: {
        label: translate(
          'pages.admin.pages.form.templates.simple.conditions.date'
        ),
        unique: true,
        verbs: [
          {
            label: translate(
              'pages.admin.pages.form.templates.simple.conditions.date.equals'
            ),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'is',
          },
          {
            label: translate(
              'pages.admin.pages.form.templates.simple.conditions.date.range'
            ),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerRangeObject,
            },
            value: 'between',
          },
          {
            label: translate(
              'pages.admin.pages.form.templates.simple.conditions.date.to'
            ),
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'to',
          },
          {
            label: translate(
              'pages.admin.pages.form.templates.simple.conditions.date.from'
            ),
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
          subjectPlaceholder={this.props.intl.formatMessage({
            id:
              'pages.admin.pages.form.templates.simple.conditions.category-placeholder',
          })}
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
        onChange={date => {
          const newStatements = statements.map((statement, index) => {
            return {
              ...statement,
              object: index === statementIndex ? { date } : statement.object,
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
            onChange={date => {
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

        <div className="mv4 mh3 c-muted-2 b">and</div>

        <div style={{ maxWidth: 140 }}>
          <DatePicker
            value={values && values.to}
            onChange={date => {
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
