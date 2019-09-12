import React, { Fragment } from 'react'
import { ObjectFieldTemplateProps } from 'react-jsonschema-form'

const hasFieldToBeDisplayed = (field: ComponentSchema): boolean => {
  if (field.type !== 'object') {
    return !field.isLayout
  }

  return Object.values(field.properties || {}).reduce<boolean>(
    (acc, currValue) => acc || hasFieldToBeDisplayed(currValue),
    false
  )
}

const ObjectFieldTemplate: React.FunctionComponent<
  ObjectFieldTemplateProps
> = ({ properties, schema }) =>
  hasFieldToBeDisplayed(schema as ComponentSchema) ? (
    <Fragment>{properties.map(property => property.content)}</Fragment>
  ) : null

ObjectFieldTemplate.defaultProps = {
  properties: [],
}

export default ObjectFieldTemplate
