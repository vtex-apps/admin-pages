import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

const hasFieldToBeDisplayed = (field, formContext) => {
  if (!formContext.isLayoutMode) {
    return true
  }

  const isLayoutMode = formContext.isLayoutMode

  return field.type === 'object'
    ? Object.keys(field.properties).reduce(
      (acc, currKey) =>
        hasFieldToBeDisplayed(field.properties[currKey], isLayoutMode) || acc,
      false
    )
    : !!field.isLayout === isLayoutMode
}

const ObjectFieldTemplate = ({
  formContext,
  idSchema: { $id: id },
  properties,
  required,
  schema,
  title,
}) =>
  hasFieldToBeDisplayed(schema, formContext) && (
    <Fragment>
      {properties.map(property => property.content)}
    </Fragment>
  )

ObjectFieldTemplate.defaultProps = {
  properties: [],
  required: false,
  title: '',
}

ObjectFieldTemplate.propTypes = {
  formContext: PropTypes.shape({
    isLayoutMode: PropTypes.bool,
  }),
  idSchema: PropTypes.object.isRequired,
  properties: PropTypes.array,
  required: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  title: PropTypes.string,
}

export default ObjectFieldTemplate
