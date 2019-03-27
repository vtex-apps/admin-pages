import { assoc, compose, dissoc, map } from 'ramda'
import React, { useState } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'

import { Button } from 'vtex.styleguide'

import withStoreSettings, { FormProps } from './components/withStoreSettings'
import { tryParseJson } from './utils/utils'

import ArrayFieldTemplate from '../../../../form/ArrayFieldTemplate'
import BaseInput from '../../../../form/BaseInput'
import FieldTemplate from '../../../../form/FieldTemplate'
import ObjectFieldTemplate from '../../../../form/ObjectFieldTemplate'

const formatSchema = (schema: any, intl: any) => {
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

const StoreForm: React.FunctionComponent<FormProps & InjectedIntlProps> = ({
  store,
  intl,
}) => {
  const [formData, setFormData] = useState(tryParseJson(store.settings))

  const handleSubmit = () => {
    console.log('todo')
  }

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
      <span className="t-heading-5 db">VTEX Store</span>
      <div className="pt2">
        <Form
          {...schemas}
          formData={formData}
          onSubmit={handleSubmit}
          onError={e => console.log('Bad input numbers: ', e.length)}
          onChange={({ formData: newFormData }) => setFormData(newFormData)}
          showErrorList={false}
          FieldTemplate={FieldTemplate}
          ArrayFieldTemplate={ArrayFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          widgets={widgets}
        >
          <div className="w-100 mt7 tr">
            <Button size="small" type="submit" variation="primary">
              <FormattedMessage id="pages.admin.pages.form.button.save" />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default withStoreSettings(injectIntl(StoreForm))
