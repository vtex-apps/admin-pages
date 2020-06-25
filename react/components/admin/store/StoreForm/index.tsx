import { JSONSchema6 } from 'json-schema'
import { assoc } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { ChildMutateProps, withMutation } from 'react-apollo'
import { FormattedMessage, useIntl, IntlShape } from 'react-intl'
import Form, { UiSchema } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Button, ToastContext } from 'vtex.styleguide'

import BaseInput from '../../../form/BaseInput'
import Toggle from '../../../form/Toggle'
import FieldTemplate from '../../../form/FieldTemplate'
import ObjectFieldTemplate from '../../../form/ObjectFieldTemplate'
import withStoreSettings, { FormProps } from './components/withStoreSettings'
import SaveAppSettings from './mutations/SaveAppSettings.graphql'
import { formatSchema, tryParseJson } from './utils'
import { CustomWidgetProps } from '../../../form/typings'
import StoreFormArrayFieldTemplate from '../../../form/ArrayFieldTemplate/StoreFormArrayFieldTemplate'

interface MutationData {
  message: string
}

interface MutationVariables {
  app: string
  version: string
  settings: string
}

type Props = ChildMutateProps<FormProps, MutationData, MutationVariables>

const CheckboxWidget = (props: CustomWidgetProps) => (
  <div className="pv4">
    <Toggle {...props} />
    {props.schema.description && (
      <span className="t-small c-muted-1 pv3 relative">
        {props.schema.description}
      </span>
    )}
  </div>
)

const widgets = {
  BaseInput,
  CheckboxWidget,
}


function removeProp(obj: Record<string, any>, propToDelete: string) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (property === propToDelete) {
        delete obj[property]
      } else {
        if (typeof obj[property] == "object") {
          if (Array.isArray(obj[property])) {
            obj[property].forEach((val: any) => removeProp(val, propToDelete))
          } else {
            removeProp(obj[property], propToDelete)
          }
        }
      }
    }
  }
}


function resolveSchemaForCurrentTab(
  tab: string | undefined,
  schema: JSONSchema6,
  intl: IntlShape,
  formData: any
) {
  const advancedSettingsSchema = (schema.dependencies?.bindingBounded as any)?.oneOf?.[0].properties.advancedSettings

  switch (tab) {
    case 'general':
      if (!formData.bindingBounded && schema.dependencies) {
        removeProp(schema.dependencies, 'advancedSettings')
      }
      return assoc<JSONSchema6>(
        'properties',
        formatSchema({
          schema: schema.properties || {},
          intl,
          ignore: ['title'],
        }),
        schema,
      )
    // return {
    //   ...schema,
    // properties: formatSchema({
    //   schema: schema.properties || {},
    //   intl,
    //   ignore: ['title'],
    //   }),
    // }
    case 'advanced':
      if (formData.bindingBounded) {
        return {} as JSONSchema6
      }
      // if () se tem bindingBounded, retornar {}
      return assoc<JSONSchema6>(
        'properties',
        formatSchema({
          schema: advancedSettingsSchema.properties || {},
          intl,
          ignore: ['title'],
        }),
        advancedSettingsSchema
      )
    default:
      return assoc<JSONSchema6>(
        'properties',
        formatSchema({
          schema: schema.properties || {},
          intl,
          ignore: ['title'],
        }),
        schema
      )
  }
}

const StoreForm: React.FunctionComponent<Props> = ({ store, mutate, tab }) => {
  console.log('teste store3: ', store)
  console.log('teste tab: ', tab)
  const intl = useIntl()
  const [formData, setFormData] = useState(tryParseJson(store.settings))
  console.log('teste formData: ', formData)

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
            intl.formatMessage({
              id: 'admin/pages.admin.pages.form.save.success',
            })
          )
        )
        .catch(() =>
          showToast(
            intl.formatMessage({
              id: 'admin/pages.admin.pages.form.save.error',
            })
          )
        )
        .finally(() => setSubmitting(false))
    }
  }, [formData, intl, mutate, showToast, store, submitting])

  const shouldDisplayWarning = tab === 'advanced'
  const { settingsSchema, settingsUiSchema } = store

  const schema = tryParseJson<JSONSchema6>(settingsSchema)
  const uiSchema = tryParseJson<UiSchema>(settingsUiSchema)

  const schemas = {
    schema: resolveSchemaForCurrentTab(tab, schema, intl, formData),
    title: formatIOMessage({ id: schema.title || '', intl }),
    ...(uiSchema && { uiSchema }),
  }

  console.log('teste schemas: ', schemas)
  //aqui

  return (
    <div className="flex flex-column justify-center">
      {shouldDisplayWarning && (
        <div className="pv3">
          <span className="c-emphasis">
            <FormattedMessage id="admin/pages.editor.store.settings.advanced.disclaimer" />
          </span>
        </div>
      )}
      <Form
        {...schemas}
        formData={formData}
        onSubmit={() => setSubmitting(true)}
        onError={e => console.error('Bad input numbers: ', e.length)}
        onChange={({ formData: newFormData }) => setFormData(newFormData)}
        showErrorList={false}
        FieldTemplate={FieldTemplate}
        ArrayFieldTemplate={StoreFormArrayFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        widgets={widgets}
      >
        <div className="w-100 tr pv3">
          <Button
            size="small"
            type="submit"
            variation="primary"
            onClick={() => setSubmitting(true)}
            isLoading={submitting}
          >
            <FormattedMessage id="admin/pages.admin.pages.form.button.save" />
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default withMutation<{ tab?: string }, MutationData, MutationVariables>(
  SaveAppSettings
)(
  withStoreSettings<ChildMutateProps<{}, MutationData, MutationVariables>>(
    StoreForm
  )
)
