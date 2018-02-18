import React from 'react'
import PropTypes from 'prop-types'

export function ObjectFieldTemplate(props) {
  return (
    <div className="f6 fw5">
      {props.properties.map(prop => prop.content)}
    </div>
  )
}

ObjectFieldTemplate.propTypes = {
  properties: PropTypes.object,
}

export function CustomFieldTemplate(props) {
  const {id, classNames, label, help, required, description, errors, children} = props
  return (
    <div className={classNames + ' fw5'}>
      <label className="mb3 mt5 fw7 db" htmlFor={id}>{label}{required ? '*' : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  )
}

CustomFieldTemplate.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.array,
  label: PropTypes.string,
  help: PropTypes.element,
  required: PropTypes.bool,
  description: PropTypes.element,
  errors: PropTypes.object,
  children: PropTypes.element,
}
