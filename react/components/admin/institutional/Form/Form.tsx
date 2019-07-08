import { RouteFormData } from 'pages'
import * as React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { Button, Input, Textarea } from 'vtex.styleguide'

import FormFieldSeparator from '../../FormFieldSeparator'
import { FormErrors } from '../../pages/Form/typings'
import SeparatorWithLine from '../../pages/SeparatorWithLine'

import RichTextEditor from '../../../RichTextEditor/index'
import SeoPreview from '../../../SeoPreview'

interface CustomProps {
  data: any
  errors: FormErrors
  handleChangeFieldValue: (field: string, value: string | number | null) => void
  isLoading: boolean
  onSubmit: (event: React.FormEvent) => void
  onExit: () => void
  isDeletable: boolean
  isInfoEditable: boolean
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

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
})

const Form = ({
  data,
  errors,
  handleChangeFieldValue,
  intl,
  isLoading,
  onExit,
  onSubmit,
}: Props) => {
  const handleEventValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    return handleChangeFieldValue(name, value)
  }

  return (
    <form onSubmit={() => null}>
      <p className="mv7 f4 b">Conteúdo</p>
      <RichTextEditor onChange={(value: string) => handleChangeFieldValue('pageContent', value)} />
      <FormFieldSeparator />

      <SeparatorWithLine />
      <p className="mv7 f4 b">SEO</p>
      <div className="flex-ns justify-between">
        <div className="w-100 w-50-ns pr4-ns">
          <Input
            name="title"
            disabled={false}
            label={intl.formatMessage(messages.fieldTitle)}
            onChange={handleEventValue}
            required
            value={data.title}
            errorMessage={errors.title && intl.formatMessage({ id: errors.title })}
          />
          <FormFieldSeparator />
          <Input
            name="path"
            disabled={false}
            label={intl.formatMessage(messages.fieldPath)}
            onChange={handleEventValue}
            placeholder={intl.formatMessage(messages.pathHint)}
            required
            value={data.path || ''}
            errorMessage={errors.path && intl.formatMessage({ id: errors.path })}
          />
          <FormFieldSeparator />
          <Textarea
            name="metaTagDescription"
            disabled={false}
            label={intl.formatMessage(messages.seoDescription)}
            onChange={handleEventValue}
            resize="vertical"
            value={data.metaTagDescription}
          />
        </div>

        <div className="w-100 w-50-ns pl4-ns">
          <SeoPreview
            title={data.title}
            url={data.path}
            description={data.metaTagDescription}
          />
        </div>
      </div>

      <div className="flex justify-end mt7">
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
          onClick={onSubmit}
          size="small"
          variation="primary"
        >
          <FormattedMessage
            id="admin/pages.admin.pages.form.button.save"
            defaultMessage="Save"
          />
        </Button>
      </div>
    </form>
  )
}

export default injectIntl(Form)