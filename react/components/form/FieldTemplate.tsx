import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FieldTemplateProps } from 'react-jsonschema-form'

interface Props {
  children?: React.ReactElement<any>
  classNames: string
  formContext: {
    isLayoutMode: boolean
  }
  hidden?: boolean
  schema: JSONSchema6
}

const FieldTemplate: React.SFC<Props & FieldTemplateProps> = ({
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
