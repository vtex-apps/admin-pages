import { path } from 'ramda'
import React from 'react'
import {
  ConditionsProps,
  ConditionsStatement,
  Dropdown,
  IconClose,
} from 'vtex.styleguide'

import { ConditionFormsData } from 'pages'
import SelectConditions from './SelectConditions'

export interface ConditionalTemplatePickerProps {
  condition: ConditionFormsData
  formErrors: Partial<{ [key in keyof Route]: string }>
  onChangeOperatorConditionalTemplate: (
    uniqueId: number,
    operator: NonNullable<ConditionsProps['operator']>
  ) => void
  onChangeTemplateConditionalTemplate: (
    uniqueId: number,
    template: string
  ) => void
  onChangeStatementsConditionalTemplate: (
    uniqueId: number,
    statements: ConditionsStatement[]
  ) => void
  onRemoveConditionalTemplate: (uniqueId: number) => void
  operator: ConditionsProps['operator']
  pageId: number
  template: string
  templates: Template[]
}

type Props = ConditionalTemplatePickerProps & ReactIntl.InjectedIntlProps

export const ConditionalTemplatePicker: React.SFC<Props> = ({
  condition,
  formErrors,
  intl,
  onChangeOperatorConditionalTemplate,
  onChangeStatementsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  operator,
  onRemoveConditionalTemplate,
  pageId,
  template,
  templates,
}) => {
  const hasError =
    !!path(['pages', pageId, 'conditions'], formErrors) ||
    !!path(['pages', pageId, 'template'], formErrors)

  const closeButtonStyle = hasError
    ? {
        marginBottom: 'auto',
        marginTop: 'auto',
      }
    : undefined

  return (
    <div className={`flex ${!hasError ? 'items-center' : ''} mv5`}>
      <div className="flex flex-column flex-grow-1 mr4 ph4">
        <Dropdown
          label={intl.formatMessage({
            id: 'pages.admin.pages.form.templates.conditional.template.label',
          })}
          options={templates.map(({ id }) => ({ value: id, label: id }))}
          onChange={(e: React.ChangeEvent, value: string) =>
            onChangeTemplateConditionalTemplate(pageId, value)
          }
          value={template}
          errorMessage={
            path(['pages', pageId, 'template'], formErrors) &&
            intl.formatMessage({
              id: path(['pages', pageId, 'template'], formErrors) as string,
            })
          }
        />
        <div className="flex flex-column w-100 mt5">
          <SelectConditions
            onChangeOperator={({ operator: newOperator }) => {
              onChangeOperatorConditionalTemplate(pageId, newOperator)
            }}
            operator={operator}
            condition={condition}
            onChangeStatements={statements => {
              onChangeStatementsConditionalTemplate(pageId, statements)
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className="w1 h1 bg-silver br-100 flex items-center justify-center bn pa1 mt6"
        style={closeButtonStyle}
        onClick={() => onRemoveConditionalTemplate(pageId)}
      >
        <IconClose color="white" size={12} />
      </button>
    </div>
  )
}
