import PropTypes from 'prop-types'
import React from 'react'
import ReactDropzone from 'react-dropzone'

const MAX_SIZE = 4 * 1024 * 1024

const Dropzone = ({ disabled, children, extraClasses, onClick, onDrop }: any) => (
  <ReactDropzone
    accept="image/*"
    className={`w-100 h4 br2 ${extraClasses}`}
    disabled={disabled}
    disablePreview={true}
    maxSize={MAX_SIZE}
    multiple={false}
    onClick={onClick}
    onDrop={onDrop}
  >
    {children}
  </ReactDropzone>
)

Dropzone.defaultProps = {
  extraClasses: '',
}

Dropzone.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool.isRequired,
  extraClasses: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
}

export default Dropzone