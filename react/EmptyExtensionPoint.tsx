import React from 'react'

interface Props {
  children?: React.ReactNode
}

// Backwards compatibility, we can delete this file upon releasing the next render-runtime.
const EmptyExtensionPoint = ({ children }: Props) => children

export default EmptyExtensionPoint
