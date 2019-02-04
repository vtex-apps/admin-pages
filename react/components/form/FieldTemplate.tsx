import PropTypes from 'prop-types'
import React from 'react'

const FieldTemplate = ({
  children,
  classNames,
  formContext,
  hidden,
  schema,
}: any) => {
  const isHidden =
    hidden ||
    (schema.type !== 'object' && formContext.isLayoutMode != null && !!schema.isLayout !== formContext.isLayoutMode)

  if (isHidden) {
    return null
  }

  return <div className={`${classNames} w-100`}>{children}</div>
}

FieldTemplate.defaultProps = {
  classNames: '',
  hidden: false,
}

FieldTemplate.propTypes = {
  children: PropTypes.element,
  classNames: PropTypes.string,
  formContext: PropTypes.shape({
    isLayoutMode: PropTypes.bool,
  }),
  hidden: PropTypes.bool,
  schema: PropTypes.object.isRequired,
}

export default FieldTemplate
