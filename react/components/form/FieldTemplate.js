import React from 'react'
import PropTypes from 'prop-types'

export default function FieldTemplate(props) {
  const { id, classNames, label, help, required, description, errors, children } = props
  return (
    <div className={`${classNames} w-100`}>
      <label className="mb3 mt5 f6 db gray" htmlFor={id}>{label}{required ? '*' : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  )
}

FieldTemplate.propTypes = {
  id: PropTypes.string,
  classNames: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.element,
  required: PropTypes.bool,
  description: PropTypes.element,
  errors: PropTypes.object,
  children: PropTypes.element,
}
