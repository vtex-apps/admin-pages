import PropTypes from 'prop-types'
import React, { Fragment } from 'react'

const ObjectFieldTemplate = ({
  description,
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
    {description && <div className="f6 gray">{description}</div>}
    {properties.map(property => property.content)}
  </Fragment>
)

ObjectFieldTemplate.defaultProps = {
  description: '',
  properties: [],
  required: false,
  title: '',
}

ObjectFieldTemplate.propTypes = {
  description: PropTypes.string,
  idSchema: PropTypes.object.isRequired,
  properties: PropTypes.array,
  required: PropTypes.bool,
  title: PropTypes.string,
}

export default ObjectFieldTemplate
