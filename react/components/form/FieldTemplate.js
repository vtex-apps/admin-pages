import React from 'react'
import PropTypes from 'prop-types'

function Label(props) {
  const { label, required, id } = props
  if (!label) {
    return <div />
  }
  return (
    <label className="control-label f6 db gray" htmlFor={id}>
      {label}
      {required && <span className="required">*</span>}
    </label>
  )
}

Label.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
}

export default function FieldTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props

  if (hidden) {
    return children
  }

  return (
    <div className={`${classNames} w-100`}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
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
  displayLabel: PropTypes.bool,
  hidden: PropTypes.bool,
}
