import React from 'react'

interface Props {
  children?: React.ReactNode
}

// Backwards compatibility, we can delete this file upon releasing the next render-runtime.
const EditableExtensionPoint = ({ children }: Props) => children || null

export default EditableExtensionPoint
