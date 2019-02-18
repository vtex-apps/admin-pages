import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation
} from '../../../../utils/components'
import EditorHeader from '../EditorHeader'
import { ComponentEditorFormContext } from '../typings'

import Form from './Form'
import { getUiSchema } from './utils'

interface CustomProps {
  editor: EditorContext
  iframeRuntime: RenderContext
  isLoading: boolean
  onChange: (event: IChangeEvent) => void
  onClose: () => void
  onSave: () => void
  props: object
  shouldRenderSaveButton: boolean
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const ComponentEditor: React.SFC<Props> = ({
  children,
  editor,
  intl,
  iframeRuntime,
  isLoading,
  onChange,
  onClose,
  onSave,
  props,
  shouldRenderSaveButton
}) => {
  const extension = getExtension(editor.editTreePath, iframeRuntime.extensions)

  const componentImplementation = getIframeImplementation(extension.component)

  const componentUiSchema =
    componentImplementation && componentImplementation.uiSchema
      ? componentImplementation.uiSchema
      : null

  const componentSchema = getComponentSchema(
    componentImplementation,
    extension.props,
    iframeRuntime,
    intl
  )

  const schema = {
    ...componentSchema,
    properties: {
      ...componentSchema.properties
    },
    title: undefined
  }

  return (
    <Fragment>
      <EditorHeader
        isLoading={isLoading}
        onClose={onClose}
        onSave={onSave}
        shouldRenderSaveButton={shouldRenderSaveButton}
        title={componentSchema.title}
      />
      <div className="ph5 h-100 overflow-y-auto">
        {children}
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
      </div>
    </Fragment>
  )
}

export default injectIntl(ComponentEditor)
