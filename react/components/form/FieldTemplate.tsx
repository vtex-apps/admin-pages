import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FieldTemplateProps } from 'react-jsonschema-form'
import { ComponentEditorFormContext } from '../EditorContainer/Sidebar/typings'

interface Props {
  children?: React.ReactNode
  classNames: string
  formContext: ComponentEditorFormContext
  hidden?: boolean
  schema: JSONSchema6
}

const FieldTemplate: React.FunctionComponent<Props & FieldTemplateProps> = ({
  children,
  classNames,
  formContext,
  hidden,
  schema,
}) => {
  const isHidden =
    hidden ||
    (schema.type !== 'object' &&
      formContext.isLayoutMode != null &&
      !!(schema as ComponentSchema).isLayout !== formContext.isLayoutMode)

  if (isHidden) {
    return null
  }

  return <div className={`${classNames} w-100`}>{children}</div>
}

FieldTemplate.defaultProps = {
  classNames: '',
  hidden: false,
}

export default FieldTemplate
