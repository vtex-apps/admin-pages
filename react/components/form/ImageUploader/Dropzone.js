import PropTypes from 'prop-types'
import React from 'react'
import ReactDropzone from 'react-dropzone'

// 4MB
const MAX_SIZE = 4194304

const Dropzone = ({ disabled, children, extraClasses, onDrop }) => (
  <ReactDropzone
    accept="image/*"
    className={`w-100 h4 br2 ${extraClasses}`}
    disabled={disabled}
    maxSize={MAX_SIZE}
    multiple={false}
    onDrop={onDrop}
  >
    {children}
  </ReactDropzone>
)

Dropzone.defaultProps = {
  extraClasses: '',
}

Dropzone.propTypes = {
  disabled: PropTypes.bool.isRequired,
  children: PropTypes.element,
  extraClasses: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
}

export default Dropzone