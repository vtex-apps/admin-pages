import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { ConditionalTemplatePicker, ConditionalTemplatePickerProps } from './ConditionalTemplatePicker'
import SectionTitle from './SectionTitle'
import { PageWithUniqueId } from './typings'

export interface ConditionalTemplateSectionProps extends ConditionalTemplatePickerProps {
  detailChangeHandlerGetter: (
    detailName: keyof Route,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: Partial<{ [key in keyof Route]: string }>
  onAddConditionalTemplate: () => void
  pages: PageWithUniqueId[]
  blockId: string
  templates: Template[]
}

type Props = ConditionalTemplateSectionProps & ReactIntl.InjectedIntlProps

export const ConditionalTemplateSection: React.SFC<Props> = ({
  detailChangeHandlerGetter,
  formErrors,
  intl,
  onAddConditionalTemplate,
  onChangeOperatorConditionalTemplate,
  onChangeStatementsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onRemoveConditionalTemplate,
  pages,
  blockId,
  templates,
}) => (
  <React.Fragment>
    <SectionTitle textId="pages.admin.pages.form.templates.title" />
    <Dropdown
      label={intl.formatMessage({
        id: 'pages.admin.pages.form.templates.field.default',
      })}
      options={templates.map(({ id }) => ({ value: id, label: id }))}
      onChange={detailChangeHandlerGetter('blockId')}
      value={blockId}
      errorMessage={
        formErrors.blockId && intl.formatMessage({ id: formErrors.blockId })
      }
    />
    <h2 className="mt7 f5 normal">
      {intl.formatMessage({
        id: 'pages.admin.pages.form.templates.conditional.title',
      })}
    </h2>
    <p className="f6 c-muted-2">
      {intl.formatMessage({
        id: 'pages.admin.pages.form.templates.conditional.description',
      })}
    </p>
    {pages.map(page => (
      <ConditionalTemplatePicker
        key={page.uniqueId}
        condition={page.condition}
        intl={intl}
        onChangeTemplateConditionalTemplate={
          onChangeTemplateConditionalTemplate
        }
        onChangeOperatorConditionalTemplate={
          onChangeOperatorConditionalTemplate
        }
        onChangeStatementsConditionalTemplate={
          onChangeStatementsConditionalTemplate
        }
        operator={page.operator}
        onRemoveConditionalTemplate={onRemoveConditionalTemplate}
        pageId={page.uniqueId}
        template={page.template}
        templates={templates}
        formErrors={formErrors}
      />
    ))}
    <button
      type="button"
      className="bg-transparent bn mt4 pl0 pointer"
      onClick={onAddConditionalTemplate}
    >
      <span className="c-action-primary f4 mr2 v-mid">+</span>{' '}
      <span className="f6 v-mid">
        {intl.formatMessage({
          id: 'pages.admin.pages.form.templates.conditional.addButton',
        })}
      </span>
    </button>
  </React.Fragment>
)

export default ConditionalTemplateSection
