import PropTypes from 'prop-types'
import React from 'react'

const FieldTemplate = ({
  children,
  classNames,
  hidden,
}) => {
  if (hidden) {
    return children
  }

  return (
    <div className={`${classNames} w-100`}>
      {children}
    </div>
  )
}

FieldTemplate.defaultProps = {
  classNames: '',
  hidden: false,
}

FieldTemplate.propTypes = {
  children: PropTypes.element,
  classNames: PropTypes.string,
  hidden: PropTypes.bool,
}

export default FieldTemplate
