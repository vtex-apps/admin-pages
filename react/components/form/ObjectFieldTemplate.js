import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

const ObjectFieldTemplate = ({
  idSchema: { $id: id },
  properties,
  required,
  title,
}) => (
  <Fragment>
    {title && (
      <label className="db f6 gray" htmlFor={id}>
        {title}
        {required && '*'}
      </label>
    )}
    {properties.map(property => property.content)}
  </Fragment>
)

ObjectFieldTemplate.defaultProps = {
  properties: [],
  required: false,
  title: '',
}

ObjectFieldTemplate.propTypes = {
  idSchema: PropTypes.object.isRequired,
  properties: PropTypes.array,
  required: PropTypes.bool,
  title: PropTypes.string,
}

export default ObjectFieldTemplate
