import React, { ReactNode } from 'react'
import { ToastProvider } from 'vtex.styleguide'
import { AdminLoadingContextProvider } from './utils/AdminLoadingContext'

interface Props {
  children?: ReactNode
}

const Wrapper: React.SFC<Props> = ({ children }) => (
  <ToastProvider positioning="window">
    <AdminLoadingContextProvider>{children}</AdminLoadingContextProvider>
  </ToastProvider>
)

export default React.memo(Wrapper)
