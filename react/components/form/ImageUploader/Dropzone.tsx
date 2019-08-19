import React, { ReactElement } from 'react'
import ReactDropzone, { DropzoneOptions } from 'react-dropzone'

interface Props {
  children: ReactElement<unknown>
  disabled: boolean
  extraClasses?: string
  onClick: React.MouseEventHandler<HTMLElement>
  onDrop: DropzoneOptions['onDrop']
  ref?: React.RefObject<HTMLDivElement>
}

const MAX_SIZE = 4 * 1024 * 1024

const Dropzone: React.FunctionComponent<Props> = React.forwardRef<
  HTMLDivElement,
  Props
>(({ disabled, children, extraClasses, onClick, onDrop }, ref) => (
  <ReactDropzone
    accept="image/*"
    disabled={disabled}
    maxSize={MAX_SIZE}
    multiple={false}
    onDrop={onDrop}
  >
    {({ getRootProps, getInputProps }) => (
      <div
        {...getRootProps({ onClick: e => onClick(e) })}
        className={`w-100 h4 br2 ${extraClasses}`}
        ref={ref}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    )}
  </ReactDropzone>
))

Dropzone.defaultProps = {
  extraClasses: '',
}

export default Dropzone
