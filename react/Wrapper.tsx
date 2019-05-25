import React, { ReactNode } from 'react'
import { ToastProvider } from 'vtex.styleguide'
import { AdminLoadingContextProvider } from './utils/AdminLoadingContext'

interface Props {
  children?: ReactNode
}

const Wrapper: React.FunctionComponent<Props> = ({ children }) => (
  <ToastProvider positioning="window">
    <AdminLoadingContextProvider>
      <div className="vh-100">{children}</div>
    </AdminLoadingContextProvider>
  </ToastProvider>
)

export default React.memo(Wrapper)
