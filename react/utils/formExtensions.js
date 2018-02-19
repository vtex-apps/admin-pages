import React from 'react'
import PropTypes from 'prop-types'

export function ObjectFieldTemplate(props) {
  return (
    <div>
      {props.properties.map(prop => prop.content)}
    </div>
  )
}

ObjectFieldTemplate.propTypes = {
  properties: PropTypes.array,
}

export function CustomFieldTemplate(props) {
  const {id, classNames, label, help, required, description, errors, children, input} = props
  return (
    <div className={classNames + ' fw5'}>
      <label className="mb3 mt5 fw3 f5 db" htmlFor={id}>{label}{required ? '*' : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  )
}

CustomFieldTemplate.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.element,
  required: PropTypes.bool,
  description: PropTypes.element,
  errors: PropTypes.object,
  children: PropTypes.element,
}
