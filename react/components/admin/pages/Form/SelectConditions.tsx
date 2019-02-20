import React from 'react'
import {
  ConditionsProps,
  ConditionsRenderFn,
  ConditionsStatement,
  DatePicker,
  EXPERIMENTAL_Conditions as Conditions,
} from 'vtex.styleguide'

import { ConditionFormsData } from 'pages'

interface Props {
  condition: ConditionFormsData
  errorMessage?: string
  operator: ConditionsProps['operator']
  onChangeOperator: ConditionsProps['onChangeOperator']
  onChangeStatements: (statements: ConditionsStatement[]) => void
}

class SelectConditions extends React.Component<Props> {
  private options: ConditionsProps['options']

  constructor(props: Props) {
    super(props)

    this.options = {
      date: {
        label: 'Date',
        unique: true,
        verbs: [
          {
            label: 'is',
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'is',
          },
          {
            label: 'is between',
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerRangeObject,
            },
            value: 'between',
          },
          {
            label: 'to',
            object: {
              extraParams: {},
              renderFn: this.complexDatePickerObject,
            },
            value: 'to',
          },
          {
            label: 'from',
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
          options={this.options}
          subjectPlaceholder="Select subject"
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
        locale="en-US"
      />
    )
  }

  private complexDatePickerRangeObject: ConditionsRenderFn = ({
    statements,
    values,
    statementIndex,
  }) => {
    return (
      <div className="flex">
        <div style={{ maxWidth: 140 }}>
          <DatePicker
            value={values && values.from}
            errorMessage={
              statements[statementIndex].object &&
              statements[statementIndex].object.from >=
                statements[statementIndex].object.to
                ? 'Must be before end date'
                : ''
            }
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
            locale="en-US"
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
            locale="en-US"
          />
        </div>
      </div>
    )
  }
}

export default SelectConditions
