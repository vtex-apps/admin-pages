import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
} from '../../../../utils/components'

import Form from './Form'
import { getUiSchema } from './utils'

interface CustomProps {
  editor: EditorContext
  onChange: (event: IChangeEvent) => void
  onSave: () => void
  props: object
  runtime: RenderContext
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const ComponentEditor: React.SFC<Props> = ({
  editor,
  intl,
  onChange,
  onSave,
  props,
  runtime,
}) => {
  const extension = getExtension(editor.editTreePath, runtime.extensions)

  const componentImplementation = getIframeImplementation(extension.component)

  const componentUiSchema =
    componentImplementation && componentImplementation.uiSchema
      ? componentImplementation.uiSchema
      : null

  const componentSchema = getComponentSchema(
    componentImplementation,
    extension.props,
    runtime,
    intl,
  )

  const schema = {
    ...componentSchema,
    properties: {
      ...componentSchema.properties,
    },
    title: undefined,
  }

  return (
    <div className="bg-white flex flex-column justify-between size-editor w-100 pb3">
      <Form
        formContext={{ isLayoutMode: editor.mode === 'layout' }}
        formData={props}
        onChange={onChange}
        onSubmit={onSave}
        schema={schema as JSONSchema6}
        uiSchema={getUiSchema(componentUiSchema, componentSchema)}
      />
      <div id="form__error-list-template___alert" />
    </div>
  )
}

export default injectIntl(ComponentEditor)
