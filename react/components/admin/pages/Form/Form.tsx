import React, { useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  Checkbox,
  Dropdown,
  EXPERIMENTAL_Select as Select,
  Input,
  Textarea,
} from 'vtex.styleguide'
import { Binding } from 'vtex.tenant-graphql'
import { KeywordsFormData, RouteFormData } from 'pages'

import FormFieldSeparator from '../../FormFieldSeparator'
import SeparatorWithLine from '../SeparatorWithLine'
import SectionTitle from './SectionTitle'
import { FormErrors } from './typings'
import {
  ConditionalTemplateSection,
  ConditionalTemplateSectionProps,
} from './ConditionalTemplateSection'
import { DropdownChangeInput } from '../../../../utils/bindings/typings'
import { getBindingSelectorOptions } from '../../../../utils/bindings'

type TemplateSectionProps = Omit<
  ConditionalTemplateSectionProps,
  'pages' | 'blockId'
>
interface Props extends TemplateSectionProps {
  data: RouteFormData
  detailChangeHandlerGetter: (
    detailName: keyof RouteFormData
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  formErrors: FormErrors
  isCustomPage: boolean
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
  onChangeKeywords: (values: KeywordsFormData[]) => void
  storeBindings: Binding[]
  onChangeBinding: (input: DropdownChangeInput) => void
}

interface BindingSelectorWrapper {
  visible: boolean
}

const messages = defineMessages({
  createKeywordsMessage: {
    defaultMessage: 'Create keyword "{keyword}"',
    id: 'admin/pages.admin.pages.form.field.meta.keywords.create',
  },
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
  noOptionsKeywordsMessage: {
    defaultMessage: 'Type your keyword and press ENTER to add it.',
    id: 'admin/pages.admin.pages.form.field.meta.description.no-options',
  },
  pathHint: {
    defaultMessage: '/my-custom-page',
    id: 'admin/pages.admin.pages.form.details.path-hint',
  },
  seoDescription: {
    defaultMessage: 'Description',
    id: 'admin/pages.admin.pages.form.field.meta.description',
  },
  seoKeywords: {
    defaultMessage: 'Keywords',
    id: 'admin/pages.admin.pages.form.field.meta.keywords',
  },
  seoRobots: {
    defaultMessage: 'Robots',
    id: 'admin/pages.admin.pages.form.field.meta.robots',
  },
  seoRobotsHelp: {
    defaultMessage: 'Robots',
    id: 'admin/store.metaTagRobots.description',
  },
  bindingSelectorTitle: {
    defaultMessage: 'Binding',
    id: 'admin/pages.admin.pages.form.binding-selector.title',
  },
})

const BindingSelectorWrapper: React.FunctionComponent<BindingSelectorWrapper> = props => {
  const { children, visible } = props
  return visible ? (
    <div>
      <FormFieldSeparator />
      {children}
      <div className="mb7 pb7 bb bw1 b--light-silver f3 normal" />
      <FormFieldSeparator />
    </div>
  ) : null
}

const Form: React.FunctionComponent<Props> = ({
  data,
  detailChangeHandlerGetter,
  formErrors,
  isCustomPage,
  isDeletable,
  isInfoEditable,
  isLoading,
  onAddConditionalTemplate,
  onChangeKeywords,
  onChangeOperatorConditionalTemplate,
  onChangeStatementsConditionalTemplate,
  onChangeTemplateConditionalTemplate,
  onDelete,
  onExit,
  onLoginToggle,
  onRemoveConditionalTemplate,
  onSave,
  templates,
  storeBindings,
  onChangeBinding,
}) => {
  const intl = useIntl()
  const path = data.path || ''

  const bindingOptions = useMemo(
    () => getBindingSelectorOptions(storeBindings),
    [storeBindings]
  )

  return (
    <form onSubmit={onSave}>
      <BindingSelectorWrapper visible={storeBindings.length > 1}>
        <Dropdown
          label={intl.formatMessage(messages.bindingSelectorTitle)}
          disabled={storeBindings.length === 1}
          onChange={onChangeBinding}
          options={bindingOptions}
          value={data.binding || storeBindings[0]}
        />
      </BindingSelectorWrapper>
      <SectionTitle textId="admin/pages.admin.pages.form.details.title" />
      <Input
        disabled={!!data.context}
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
        placeholder={intl.formatMessage(messages.pathHint)}
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
        label={intl.formatMessage(messages.fieldLogin)}
        name="checkbox-login"
        onChange={onLoginToggle}
        value="option-0"
      />
      {isCustomPage && (
        <>
          <FormFieldSeparator />
          <Textarea
            disabled={!!data.context}
            label={intl.formatMessage(messages.seoDescription)}
            onChange={detailChangeHandlerGetter('metaTagDescription')}
            resize="vertical"
            value={data.metaTagDescription}
          />
          <FormFieldSeparator />
          <Select
            creatable
            disabled={!!data.context}
            formatCreateLabel={(keyword: string) =>
              intl.formatMessage(messages.createKeywordsMessage, { keyword })
            }
            label={intl.formatMessage(messages.seoKeywords)}
            noOptionsMessage={() =>
              intl.formatMessage(messages.noOptionsKeywordsMessage)
            }
            onChange={onChangeKeywords}
            placeholder=""
            value={data.metaTagKeywords}
          />
        </>
      )}
      <FormFieldSeparator />
      <Input
        disabled={!!data.context}
        label={intl.formatMessage(messages.seoRobots)}
        onChange={detailChangeHandlerGetter('metaTagRobots')}
        required
        value={data.metaTagRobots}
        helpText={intl.formatMessage(messages.seoRobotsHelp)}
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

export default Form
