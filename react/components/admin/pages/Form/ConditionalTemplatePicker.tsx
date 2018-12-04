import { path } from 'ramda'
import React from 'react'
import { Dropdown, IconClose } from 'vtex.styleguide'

import Select from '../../../Select'

interface ConditionalTemplatePickerProps {
  availableConditions: Condition[]
  conditions: string[]
  onChangeConditionsConditionalTemplate: (
    uniqueId: number,
    conditions: string[],
  ) => void
  onChangeTemplateConditionalTemplate: (
    uniqueId: number,
    template: string,
  ) => void
  onRemoveConditionalTemplate: (uniqueId: number) => void
  formErrors: Partial<{ [key in keyof Route]: string }>
  pageId: number
  template: string
  templates: Template[]
}

type Props = ConditionalTemplatePickerProps & ReactIntl.InjectedIntlProps

export const ConditionalTemplatePicker: React.SFC<Props> = ({
  availableConditions,
  conditions,
  formErrors,
  intl,
  onChangeConditionsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onRemoveConditionalTemplate,
  pageId,
  template,
  templates,
}) => {
  const hasError =
    !!path(['pages', pageId, 'conditions'], formErrors) ||
    path(['pages', pageId, 'template'], formErrors)
  return (
    <div className={`flex ${!hasError && 'items-center'} mv5 mw7`}>
      <div className="flex-grow-1">
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
      </div>
      <div className="flex flex-column w-50 mh5">
        <label>
          <span className="dib mb3 w-100 f6">
            <span>
              {intl.formatMessage({
                id:
                  'pages.admin.pages.form.templates.conditional.conditions.label',
              })}
            </span>
          </span>
        </label>
        <Select
          errorMessage={path(['pages', pageId, 'conditions'], formErrors)}
          onChange={values => {
            onChangeConditionsConditionalTemplate(pageId, values)
          }}
          options={availableConditions.map(({ conditionId }) => ({
            label: conditionId,
            value: conditionId,
          }))}
          value={conditions}
        />
      </div>
      <button
        type="button"
        className="w1 h1 bg-silver br-100 flex items-center justify-center bn pa1 mt6"
        style={
          hasError
            ? {
                marginBottom: 'auto',
                marginTop: 'auto',
              }
            : undefined
        }
        onClick={() => onRemoveConditionalTemplate(pageId)}
      >
        <IconClose color="white" size={12} />
      </button>
    </div>
  )
}
