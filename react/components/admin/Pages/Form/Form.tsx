import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import { Button, Checkbox, Input } from 'vtex.styleguide'

import FormFieldSeparator from '../../FormFieldSeparator'
import SeparatorWithLine from '../SeparatorWithLine'
import { getRouteTitle, isNewRoute } from '../utils'

import SectionTitle from './SectionTitle'

import { ConditionalTemplateSection } from './ConditionalTemplateSection'
import { TemplateDropdown } from './TemplateDropdown'
import { PageWithUniqueId } from './typings'

interface CustomProps {
  conditions: Condition[]
  canAddConditionalTemplates: boolean
  data: Route
  detailChangeHandlerGetter: (
    detailName: keyof Route,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
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
  conditions,
  canAddConditionalTemplates,
  data,
  detailChangeHandlerGetter,
  intl,
  isLoading,
  onAddConditionalTemplate,
  onChangeConditionsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onDelete,
  onExit,
  onLoginToggle,
  onRemoveConditionalTemplate,
  onSave,
  templates,
}) => {
  const { declarer } = data.pages[0] || { declarer: null }

  const isNew = isNewRoute(data.id)

  const isDeletable = !declarer && !isNew
  const isInfoEditable = !declarer || isNew

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
        value={getRouteTitle(data)}
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
      />
      { !canAddConditionalTemplates &&
        <Fragment>
          <FormFieldSeparator />
          <TemplateDropdown
            intl={intl}
            detailChangeHandlerGetter={detailChangeHandlerGetter}
            label="pages.admin.pages.form.templates.conditional.template.label"
            placeholder="pages.admin.pages.form.templates.conditional.template.placeholder"
            template={data.template}
            templates={templates}
          />
        </Fragment>
      }
      <FormFieldSeparator />
      <Checkbox
        checked={!!data.login}
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
      { canAddConditionalTemplates &&
        <Fragment>
          <ConditionalTemplateSection
            intl={intl}
            detailChangeHandlerGetter={detailChangeHandlerGetter}
            pages={data.pages as PageWithUniqueId[]}
            templates={templates}
            template={data.template}
            conditions={conditions}
            onAddConditionalTemplate={onAddConditionalTemplate}
            onRemoveConditionalTemplate={onRemoveConditionalTemplate}
            onChangeTemplateConditionalTemplate={
              onChangeTemplateConditionalTemplate
            }
            onChangeConditionsConditionalTemplate={
              onChangeConditionsConditionalTemplate
            }
          />
          <SeparatorWithLine />
          <FormFieldSeparator />
        </Fragment>
      }
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
