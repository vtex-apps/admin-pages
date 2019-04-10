import { assoc, compose, dissoc, map } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { ChildMutateProps, MutateProps, withMutation } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'

import { Button, ToastContext } from 'vtex.styleguide'

import ArrayFieldTemplate from '../../../../form/ArrayFieldTemplate'
import BaseInput from '../../../../form/BaseInput'
import FieldTemplate from '../../../../form/FieldTemplate'
import ObjectFieldTemplate from '../../../../form/ObjectFieldTemplate'

import withStoreSettings, { FormProps } from './components/withStoreSettings'
import { tryParseJson } from './utils/utils'

import SaveAppSettings from './mutations/SaveAppSettings.graphql'

interface MutationData {
  message: string
}

interface MutationVariables {
  app: string
  version: string
  settings: string
}

type Props = ChildMutateProps<
  FormProps & InjectedIntlProps,
  MutationData,
  MutationVariables
>

const formatSchema = (schema: any, intl: any): any => {
  if (!schema) {
    return null
  }
  return compose<any, any, any, any>(
    map((val: any) => {
      const formattedSchema: any = formatSchema(val.properties, intl)
      return formattedSchema ? assoc('properties', formattedSchema, val) : val
    }),
    map((val: any) => {
      const translatedTitle = val.title
        ? intl.formatMessage({ id: val.title })
        : null
      return translatedTitle ? assoc('title', translatedTitle, val) : val
    }),
    map((val: any) => {
      const translatedDescription = val.description
        ? intl.formatMessage({ id: val.description })
        : null
      return translatedDescription
        ? assoc('description', translatedDescription, val)
        : val
    })
  )(schema)
}

const widgets = {
  BaseInput,
}

const StoreForm: React.FunctionComponent<Props> = ({ store, intl, mutate }) => {
  const [formData, setFormData] = useState(tryParseJson(store.settings))
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (submitting) {
      const { slug: app, version } = store
      mutate({
        variables: { app, version, settings: JSON.stringify(formData) },
      })
        .then(() =>
          showToast(
            intl.formatMessage({ id: 'pages.admin.pages.form.save.success' })
          )
        )
        .catch(() =>
          showToast(
            intl.formatMessage({ id: 'pages.admin.pages.form.save.error' })
          )
        )
        .finally(() => setSubmitting(false))
    }
  }, [submitting])

  const { settingsSchema, settingsUiSchema } = store
  const schemas: { title: string; schema: any; uiSchema?: any } = {
    schema: null,
    title: '',
  }
  const schema = tryParseJson(settingsSchema)
  if (schema) {
    schemas.title = intl.formatMessage({ id: schema.title })
    schemas.schema = assoc(
      'properties',
      formatSchema(dissoc('title', schema).properties, intl),
      schema
    )
  }
  const uiSchema = tryParseJson(settingsUiSchema)
  if (uiSchema) {
    schemas.uiSchema = uiSchema
  }

  return (
    <div className="flex flex-column justify-center">
      <div className="t-heading-5">
        <FormattedMessage id="pages.editor.store.settings.title" />
      </div>
      <div className="pt2">
        <Form
          {...schemas}
          formData={formData}
          onSubmit={() => setSubmitting(true)}
          onError={e => console.log('Bad input numbers: ', e.length)}
          onChange={({ formData: newFormData }) => setFormData(newFormData)}
          showErrorList={false}
          FieldTemplate={FieldTemplate}
          ArrayFieldTemplate={ArrayFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          widgets={widgets}
        >
          <div className="w-100 tr">
            <Button
              size="small"
              type="submit"
              variation="primary"
              onClick={() => setSubmitting(true)}
              isLoading={submitting}
            >
              <FormattedMessage id="pages.admin.pages.form.button.save" />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default withMutation<{}, MutationData, MutationVariables>(
  SaveAppSettings
)(
  withStoreSettings<ChildMutateProps<{}, MutationData, MutationVariables>>(
    injectIntl(StoreForm)
  )
)
