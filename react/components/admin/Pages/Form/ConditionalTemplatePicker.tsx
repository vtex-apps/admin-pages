import React from 'react'
import ReactSelect, { Option } from 'react-select'
import {
  Dropdown,
  IconCaretDown,
  IconCaretUp,
  IconClose,
} from 'vtex.styleguide'

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
  pageId: number
  template: string
  templates: Template[]
}

type Props = ConditionalTemplatePickerProps & ReactIntl.InjectedIntlProps

export const ConditionalTemplatePicker: React.SFC<Props> = ({
  availableConditions,
  conditions,
  intl,
  templates,
  onChangeConditionsConditionalTemplate,
  template,
  onRemoveConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  pageId,
}) => (
  <div className="flex items-center mv5 mw7">
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
      />
    </div>
    <div className="w-50 mh5">
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
      <ReactSelect
        className="f6"
        arrowRenderer={(
          { onMouseDown, isOpen }: any, // ArrowRendererProps isn't defining isOpen.
        ) => (
          <div onMouseDown={onMouseDown}>
            {isOpen ? (
              <IconCaretUp color="#134cd8" size={8} />
            ) : (
              <IconCaretDown color="#134cd8" size={8} />
            )}
          </div>
        )}
        multi
        onChange={optionValues => {
          const formattedValue = (optionValues as Option[]).map(
            (item: Option) => item.value as string,
          )
          onChangeConditionsConditionalTemplate(pageId, formattedValue)
        }}
        options={availableConditions.map(({ conditionId }) => ({
          label: conditionId,
          value: conditionId,
        }))}
        placeholder={
          <span className="ml2">
            {intl.formatMessage({
              id: 'pages.editor.components.conditions.custom.placeholder',
            })}
          </span>
        }
        value={conditions}
      />
    </div>
    <button
      type="button"
      className="bg-silver br-100 flex items-center justify-center bn pa1 mt6"
      onClick={() => onRemoveConditionalTemplate(pageId)}
    >
      <IconClose color="white" size={12} />
    </button>
  </div>
)
