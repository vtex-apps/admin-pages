import React from 'react'
import PropTypes from 'prop-types'

export default function FieldTemplate(props) {
  const {id, classNames, label, help, required, description, errors, children} = props
  return (
    <div className={classNames + ' fw5 w-100'}>
      <label className="mb3 mt5 fw5 f5 db" htmlFor={id}>{label}{required ? '*' : null}</label>
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
