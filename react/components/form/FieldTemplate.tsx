import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FieldTemplateProps } from 'react-jsonschema-form'

interface Props {
  children?: React.ReactNode
  classNames: string
  hidden?: boolean
  schema: JSONSchema6
}

const FieldTemplate: React.FunctionComponent<Props & FieldTemplateProps> = ({
  children,
  classNames,
  hidden,
  schema,
}) => {
  const isHidden =
    hidden || (schema.type !== 'object' && (schema as ComponentSchema).isLayout)

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
