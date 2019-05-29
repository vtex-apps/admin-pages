import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import {
  ConditionalTemplatePicker,
  ConditionalTemplatePickerProps,
} from './ConditionalTemplatePicker'
import SectionTitle from './SectionTitle'
import { FormErrors } from './typings'

import { PagesFormData, RouteFormData } from 'pages'

type TemplatePickerCallbacks = Pick<
  ConditionalTemplatePickerProps,
  | 'onChangeOperatorConditionalTemplate'
  | 'onChangeStatementsConditionalTemplate'
  | 'onChangeTemplateConditionalTemplate'
  | 'onRemoveConditionalTemplate'
>

export interface ConditionalTemplateSectionProps
  extends TemplatePickerCallbacks {
  detailChangeHandlerGetter: (
    detailName: keyof RouteFormData
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  formErrors: FormErrors
  onAddConditionalTemplate: () => void
  pages: PagesFormData[]
  blockId: string
  templates: Template[]
}

type Props = ConditionalTemplateSectionProps & ReactIntl.InjectedIntlProps

const messages = defineMessages({
  defaultFieldLabel: {
    defaultMessage: 'Default',
    id: 'admin/pages.admin.pages.form.templates.field.default',
  },
  templateTitle: {
    defaultMessage: 'Templates',
    id: 'admin/pages.admin.pages.form.templates.title',
  },
})

export const ConditionalTemplateSection: React.FunctionComponent<Props> = ({
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
    <SectionTitle textId="admin/pages.admin.pages.form.templates.title" />
    <Dropdown
      label={intl.formatMessage(messages.defaultFieldLabel)}
      options={templates.map(({ id }) => ({ value: id, label: id }))}
      onChange={detailChangeHandlerGetter('blockId')}
      value={blockId}
      errorMessage={
        formErrors.blockId && intl.formatMessage({ id: formErrors.blockId })
      }
    />
    <h2 className="mt7 f5 normal">
      <FormattedMessage
        id="admin/pages.admin.pages.form.templates.conditional.title"
        defaultMessage="Conditional"
      />
    </h2>
    <p className="f6 c-muted-2">
      <FormattedMessage
        id="admin/pages.admin.pages.form.templates.conditional.description"
        defaultMessage="Conditional template enables the use of a variant layout to your page. This layout will appear when it matches with the conditions set."
      />
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
      <span className="c-action-primary f4 mr2 v-mid">+</span>
      <span className="f6 v-mid">
        <FormattedMessage
          id="admin/pages.admin.pages.form.templates.conditional.addButton"
          defaultMessage="Add conditional template"
        />
      </span>
    </button>
  </React.Fragment>
)

export default ConditionalTemplateSection
