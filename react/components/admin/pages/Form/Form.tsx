import React from 'react'
import { injectIntl } from 'react-intl'
import { Button, Checkbox, Input } from 'vtex.styleguide'

import { RouteFormData } from 'pages'
import FormFieldSeparator from '../../FormFieldSeparator'
import SeparatorWithLine from '../SeparatorWithLine'
import { isNewRoute } from '../utils'

import SectionTitle from './SectionTitle'

import { ConditionalTemplateSection, ConditionalTemplateSectionProps } from './ConditionalTemplateSection'
import { PageWithUniqueId } from './typings'

interface CustomProps extends ConditionalTemplateSectionProps {
  data: RouteFormData
  detailChangeHandlerGetter: (
    detailName: keyof Route,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  formErrors: Partial<{ [key in keyof Route]: string }>
  isLoading: boolean
  onDelete: () => void
  onExit: () => void
  onLoginToggle: () => void
  onSave: (event: React.FormEvent) => void
  onAddConditionalTemplate: () => void
  onChangeConditionsConditionalTemplate: (
    uniqueId: number,
    conditions: string[],
  ) => void
  onChangeTemplateConditionalTemplate: (
    uniqueId: number,
    template: string,
  ) => void
  onRemoveConditionalTemplate: (uniqueId: number) => void
  templates: Template[]
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const Form: React.SFC<Props> = ({
  data,
  detailChangeHandlerGetter,
  formErrors,
  intl,
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
  const { declarer } = data || { declarer: null }

  const isNew = isNewRoute(data)

  const isDeletable = declarer !== 'vtex.store@2.x' && !isNew
  const isInfoEditable = declarer !== 'vtex.store@2.x' || isNew

  const path = data.path || ''

  return (
    <form onSubmit={onSave}>
      <SectionTitle textId="pages.admin.pages.form.details.title" />
      <Input
        disabled={!isInfoEditable}
        label={intl.formatMessage({
          id: 'pages.admin.pages.form.field.title',
        })}
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
        label={intl.formatMessage({
          id: 'pages.admin.pages.form.field.path',
        })}
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
      <Checkbox
        checked={!!data.auth}
        disabled={!isInfoEditable}
        label={intl.formatMessage({
          id: 'pages.admin.pages.form.field.login',
        })}
        name="checkbox-login"
        onChange={onLoginToggle}
        value="option-0"
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
        onChangeOperatorConditionalTemplate={onChangeOperatorConditionalTemplate}
        onChangeStatementsConditionalTemplate={onChangeStatementsConditionalTemplate}
        formErrors={formErrors}
      />
      <SeparatorWithLine />
      <FormFieldSeparator />
      <div className={isDeletable ? 'flex justify-between' : ''}>
        {isDeletable && (
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            onClick={onDelete}
            size="small"
            variation="danger"
          >
            {intl.formatMessage({
              id: 'pages.admin.pages.form.button.delete',
            })}
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
              {intl.formatMessage({
                id: 'pages.admin.pages.form.button.cancel',
              })}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            onClick={onSave}
            size="small"
            variation="primary"
          >
            {intl.formatMessage({
              id: 'pages.admin.pages.form.button.save',
            })}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default injectIntl(Form)
