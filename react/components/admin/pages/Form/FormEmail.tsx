import React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { Button, Checkbox, Input } from 'vtex.styleguide'

import { RouteFormData } from 'pages'
import FormFieldSeparator from '../../FormFieldSeparator'
import SeparatorWithLine from '../SeparatorWithLine'

import SectionTitle from './SectionTitle'
import { FormErrors } from './typings'

import {
  ConditionalTemplateSection,
  ConditionalTemplateSectionProps,
} from './ConditionalTemplateSection'

type TemplateSectionProps = Omit<
  ConditionalTemplateSectionProps,
  'pages' | 'blockId'
>
interface CustomProps extends TemplateSectionProps {
  data: RouteFormData
  detailChangeHandlerGetter: (
    detailName: keyof Route
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: FormErrors
  isDeletable: boolean
  isInfoEditable: boolean
  isLoading: boolean
  onDelete: () => void
  onExit: () => void
  onLoginToggle: () => void
  onSave: (event: React.FormEvent) => void
  onAddConditionalTemplate: () => void
  onChangeTemplateConditionalTemplate: (
    uniqueId: number,
    template: string
  ) => void
  onRemoveConditionalTemplate: (uniqueId: number) => void
  templates: Template[]
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const messages = defineMessages({
  detailsTitle: {
    defaultMessage: 'Page details',
    id: 'admin/pages.admin.pages.form.details.title',
  },
  fieldLogin: {
    defaultMessage: 'Requires authentication',
    id: 'admin/pages.admin.pages.form.field.login',
  },
  fieldPath: {
    defaultMessage: 'URL',
    id: 'admin/pages.admin.pages.form.field.path',
  },
  fieldTitle: {
    defaultMessage: 'Title',
    id: 'admin/pages.admin.pages.form.field.title',
  },
})

const FormEmail: React.FunctionComponent<Props> = ({
  data,
  detailChangeHandlerGetter,
  formErrors,
  intl,
  isDeletable,
  isInfoEditable,
  isLoading,
  onAddConditionalTemplate,
  onChangeOperatorConditionalTemplate,
  onChangeStatementsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onDelete,
  onExit,
  onLoginToggle,
  onRemoveConditionalTemplate,
  onSave,
  templates,
}) => {
  const path = data.path || ''

  return (
    <form onSubmit={onSave}>
      <SectionTitle textId="admin/pages.admin.pages.form.details.title" />
      <Input
        disabled={!isInfoEditable}
        label={intl.formatMessage(messages.fieldTitle)}
        onChange={detailChangeHandlerGetter('title')}
        required
        value={data.title}
        errorMessage={
          formErrors.title &&
          intl.formatMessage({
            id: formErrors.title,
          })
        }
      />
      <FormFieldSeparator />
      <Input
        disabled={!isInfoEditable}
        label={intl.formatMessage(messages.fieldPath)}
        onChange={detailChangeHandlerGetter('path')}
        required
        value={path}
        errorMessage={
          formErrors.path &&
          intl.formatMessage({
            id: formErrors.path,
          })
        }
      />
      <FormFieldSeparator />
      <SeparatorWithLine />
      <ConditionalTemplateSection
        intl={intl}
        detailChangeHandlerGetter={detailChangeHandlerGetter}
        pages={data.pages}
        templates={templates}
        blockId={data.blockId}
        onAddConditionalTemplate={onAddConditionalTemplate}
        onRemoveConditionalTemplate={onRemoveConditionalTemplate}
        onChangeTemplateConditionalTemplate={
          onChangeTemplateConditionalTemplate
        }
        onChangeOperatorConditionalTemplate={
          onChangeOperatorConditionalTemplate
        }
        onChangeStatementsConditionalTemplate={
          onChangeStatementsConditionalTemplate
        }
        formErrors={formErrors}
      />
      <SeparatorWithLine />
      <FormFieldSeparator />
      <div className={isDeletable ? 'flex justify-between' : ''}>
        {isDeletable && (
          <Button
            disabled={isLoading}
            onClick={onDelete}
            size="small"
            variation="danger"
          >
            <FormattedMessage
              id="admin/pages.admin.pages.form.button.delete"
              defaultMessage="Delete"
            />
          </Button>
        )}
        <div className="flex justify-end">
          <div className="mr6">
            <Button
              disabled={isLoading}
              onClick={onExit}
              size="small"
              variation="tertiary"
            >
              <FormattedMessage
                id="admin/pages.admin.pages.form.button.cancel"
                defaultMessage="Cancel"
              />
            </Button>
          </div>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            onClick={onSave}
            size="small"
            variation="primary"
          >
            <FormattedMessage
              id="admin/pages.admin.pages.form.button.save"
              defaultMessage="Save"
            />
          </Button>
        </div>
      </div>
    </form>
  )
}

export default injectIntl(FormEmail)
