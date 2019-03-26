import React, { ReactElement } from 'react'
import ReactDropzone, { DropFilesEventHandler } from 'react-dropzone'

interface Props {
  children: ReactElement<any>
  disabled: boolean
  extraClasses?: string
  onClick: React.MouseEventHandler<HTMLDivElement>
  onDrop: DropFilesEventHandler
}

const MAX_SIZE = 4 * 1024 * 1024

const Dropzone: React.FunctionComponent<Props> = ({
  disabled,
  children,
  extraClasses,
  onClick,
  onDrop,
}) => (
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

export default Dropzone
