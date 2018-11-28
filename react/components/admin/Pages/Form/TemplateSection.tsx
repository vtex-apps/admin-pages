import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { ConditionalTemplatePicker } from './ConditionalTemplatePicker'
import SectionTitle from './SectionTitle'

interface TemplateSectionProps {}

export const TemplateSection: React.SFC<TemplateSectionProps> = ({
  conditions,
  pages,
  templates,
  templateId,
  detailChangeHandlerGetter,
  intl,
  onAddConditionalTemplate,
  onRemoveConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onChangeConditionsConditionalTemplate,
}) => (
  <React.Fragment>
    <SectionTitle textId="pages.admin.pages.form.templates.title" />
    <Dropdown
      label={intl.formatMessage({
        id: 'pages.admin.pages.form.templates.field.default',
      })}
      options={templates.map(({ id }) => ({ value: id, label: id }))}
      onChange={detailChangeHandlerGetter('templateId')}
      value={templateId}
    />
    <h2 className="mt7 f5 normal">Conditional</h2>
    <p className="f6 c-muted-2">
      Conditional template enables the use of a variant layout to your page.
      This layout will appear when it matches with the conditions set.
    </p>
    {pages.map((page) => (
      <ConditionalTemplatePicker
        key={page.uniqueId}
        availableConditions={conditions}
        conditions={page.conditions}
        intl={intl}
        onChangeConditionsConditionalTemplate={onChangeConditionsConditionalTemplate}
        onChangeTemplateConditionalTemplate={onChangeTemplateConditionalTemplate}
        onRemoveConditionalTemplate={onRemoveConditionalTemplate}
        pageId={page.uniqueId}
        templateId={page.template}
        templates={templates}
      />
    ))}
    <button
      type="button"
      className="bg-transparent bn mt4 pl0 pointer"
      onClick={onAddConditionalTemplate}
    >
      <span className="c-action-primary f4 mr2 v-mid">+</span>{' '}
      <span className="f6 v-mid">Add conditional template</span>
    </button>
  </React.Fragment>
)

export default TemplateSection
