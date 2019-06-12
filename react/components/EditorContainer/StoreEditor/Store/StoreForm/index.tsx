import { JSONSchema6 } from 'json-schema'
import { assoc, dissoc } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { ChildMutateProps, withMutation } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { Button, ToastContext } from 'vtex.styleguide'

import ArrayFieldTemplate from '../../../../form/ArrayFieldTemplate'
import BaseInput from '../../../../form/BaseInput'
import FieldTemplate from '../../../../form/FieldTemplate'
import ObjectFieldTemplate from '../../../../form/ObjectFieldTemplate'

import withStoreSettings, { FormProps } from './components/withStoreSettings'
import SaveAppSettings from './mutations/SaveAppSettings.graphql'
import { formatSchema, tryParseJson } from './utils'

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

const widgets = {
  BaseInput,
}

const StoreForm: React.FunctionComponent<Props> = ({ store, intl, mutate }) => {
  const [formData, setFormData] = useState(tryParseJson(store.settings))

  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useContext(ToastContext)

  useEffect(
    () => {
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
    },
    [submitting]
  )

  const { settingsSchema, settingsUiSchema } = store

  const schema = tryParseJson(settingsSchema)
  const uiSchema = tryParseJson(settingsUiSchema)

  const schemas = {
    ...(schema && {
      schema: assoc<JSONSchema6>(
        'properties',
        formatSchema(dissoc('title', schema).properties, intl),
        schema
      ),
      title: formatIOMessage({ id: schema.title, intl }),
    }),
    ...(uiSchema && { uiSchema }),
  }

  return (
    <div className="flex flex-column justify-center">
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
            <FormattedMessage id="admin/pages.admin.pages.form.button.save" />
          </Button>
        </div>
      </Form>
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
