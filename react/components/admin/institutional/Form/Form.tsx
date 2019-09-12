import { RouteFormData } from 'pages'
import * as React from 'react'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'

import { Button, Input, Textarea } from 'vtex.styleguide'

import { RouteContentFromData } from './index'
import { slugify } from './utils'

import FormFieldSeparator from '../../FormFieldSeparator'
import { FormErrors } from '../../pages/Form/typings'
import SeparatorWithLine from '../../pages/SeparatorWithLine'

import RichTextEditor from '../../../RichTextEditor/index'
import SeoPreview from '../../../SeoPreview'

interface CustomProps {
  data: RouteFormData & RouteContentFromData
  errors: FormErrors
  isLoading: boolean
  onDelete: () => void
  onExit: () => void
  onFieldValueChange: (field: string, value: string | number | null) => void
  onSubmit: (event: React.FormEvent) => void
  isDeletable: boolean
  isInfoEditable: boolean
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const messages = defineMessages({
  contentSection: {
    defaultMessage: 'Content',
    id: 'admin/pages.admin.content.content.section-title',
  },
  fieldPath: {
    defaultMessage: 'URL',
    id: 'admin/pages.admin.content.general.url.label',
  },
  fieldTitle: {
    defaultMessage: 'Title',
    id: 'admin/pages.admin.content.general.title.label',
  },
  generalSection: {
    defaultMessage: 'General',
    id: 'admin/pages.admin.content.general.section-title',
  },
  pathHint: {
    defaultMessage: '/my-custom-page',
    id: 'admin/pages.admin.content.general.url.placeholder',
  },
  seoDescription: {
    defaultMessage: 'Description',
    id: 'admin/pages.admin.content.general.description.label',
  },
  titleHint: {
    defaultMessage: 'e.g.: About us',
    id: 'admin/pages.admin.content.general.title.placeholder',
  },
})

const Form = ({
  data,
  errors,
  intl,
  isDeletable,
  isLoading,
  onDelete,
  onExit,
  onFieldValueChange,
  onSubmit,
}: Props) => {
  const [hasDefinedPath, setHasDefinedPath] = React.useState(false)

  const handlePathChange = (value: string) => {
    return onFieldValueChange('path', `/${slugify(value)}`)
  }

  const handleEventValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    /** auto fill path based on title if path was not specified yet */
    if (name === 'title' && !hasDefinedPath) handlePathChange(value)

    return onFieldValueChange(name, value)
  }

  return (
    <form onSubmit={() => null}>
      <p className="mv7 f4 b">Geral</p>
      <div className="flex-ns justify-between">
        <div className="w-100 w-50-ns pr4-ns">
          <Input
            name="title"
            disabled={false}
            label={intl.formatMessage(messages.fieldTitle)}
            onChange={handleEventValue}
            placeholder={intl.formatMessage(messages.titleHint)}
            required
            value={data.title}
            errorMessage={
              errors.title && intl.formatMessage({ id: errors.title })
            }
          />
          <FormFieldSeparator />
          <Input
            name="path"
            disabled={false}
            label={intl.formatMessage(messages.fieldPath)}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              const { value } = event.target
              if (hasDefinedPath && !value.length) setHasDefinedPath(false)
              else if (!hasDefinedPath && value.length) setHasDefinedPath(true)
              return handleEventValue(event)
            }}
            onBlur={() => handlePathChange(data.path)}
            placeholder={intl.formatMessage(messages.pathHint)}
            required
            value={data.path || ''}
            errorMessage={
              errors.path && intl.formatMessage({ id: errors.path })
            }
          />
          <FormFieldSeparator />
          <Textarea
            name="metaTagDescription"
            disabled={false}
            label={intl.formatMessage(messages.seoDescription)}
            onChange={handleEventValue}
            resize="vertical"
            value={data.metaTagDescription}
            size="small"
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

      <FormFieldSeparator />
      <SeparatorWithLine />

      <p className="mv7 f4 b">{intl.formatMessage(messages.contentSection)}</p>
      <RichTextEditor
        initialState={data.pageContent}
        onChange={(value: string) => onFieldValueChange('pageContent', value)}
      />

      <FormFieldSeparator />

      <div className={`${isDeletable && 'flex justify-between'}`}>
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
      </div>
    </form>
  )
}

export default injectIntl(Form)
