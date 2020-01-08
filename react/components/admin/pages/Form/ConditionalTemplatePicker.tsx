import { path } from 'ramda'
import React from 'react'
import {
  defineMessages,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import {
  ConditionsProps,
  ConditionsStatement,
  Dropdown,
  IconClose,
} from 'vtex.styleguide'
import { ConditionFormsData } from 'pages'

import SelectConditions from './SelectConditions'
import { FormErrors } from './typings'

export interface ConditionalTemplatePickerProps {
  condition: ConditionFormsData
  formErrors: FormErrors
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

type Props = ConditionalTemplatePickerProps & ComponentWithIntlProps

const messages = defineMessages({
  errorMessage: {
    defaultMessage: 'Required',
    id: 'admin/pages.admin.pages.form.templates.field.required',
  },
  pathValidationErrorMessage: {
    defaultMessage: `URL should begin with '/'.`,
    id: 'admin/pages.admin.pages.form.templates.path.validation-error',
  },
  templateLabel: {
    defaultMessage: 'Template',
    id: 'admin/pages.admin.pages.form.templates.conditional.template.label',
  },
})

export const ConditionalTemplatePicker: React.FunctionComponent<Props> = ({
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
    !!path(['pages', pageId, 'condition'], formErrors) ||
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
          label={intl.formatMessage(messages.templateLabel)}
          options={templates.map(({ id }) => ({ value: id, label: id }))}
          onChange={(_: React.ChangeEvent, value: string) =>
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
            errorMessage={
              path(['pages', pageId, 'condition'], formErrors) &&
              intl.formatMessage({
                id: path(['pages', pageId, 'condition'], formErrors) as string,
              })
            }
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
