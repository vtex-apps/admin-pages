import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { ObjectFieldTemplateProps } from 'react-jsonschema-form'
import { ComponentEditorFormContext } from '../EditorContainer/Sidebar/ComponentEditor'

const hasFieldToBeDisplayed = (
  field: JSONSchema6,
  formContext: ComponentEditorFormContext
): boolean => {
  if (!formContext.isLayoutMode) {
    return true
  }

  const isLayoutMode = formContext.isLayoutMode

  return field.type === 'object'
    ? Object.keys(field.properties || {}).reduce(
        (acc: boolean, currKey: string) =>
          hasFieldToBeDisplayed((field as any).properties[currKey], {
            isLayoutMode,
          }) || acc,
        false
      )
    : !!(field as ComponentSchema).isLayout === isLayoutMode
}

interface Props extends ObjectFieldTemplateProps {
  formContext: ComponentEditorFormContext
}

const ObjectFieldTemplate: React.SFC<Props> = ({
  formContext,
  properties,
  schema,
}) =>
  hasFieldToBeDisplayed(schema, formContext) ? (
    <Fragment>{properties.map(property => property.content)}</Fragment>
  ) : null

ObjectFieldTemplate.defaultProps = {
  properties: [],
  required: false,
  title: '',
}

export default ObjectFieldTemplate
