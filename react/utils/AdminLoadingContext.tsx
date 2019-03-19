import React, { FunctionComponent, useContext } from 'react'

const AdminLoadingContext = React.createContext({
  startLoading: () => {
    window.postMessage({ action: { type: 'START_LOADING' } }, '*')
  },
  stopLoading: () => {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  },
})

const adminLoadingDefaultValue = {
  startLoading: () => {
    window.postMessage({ action: { type: 'START_LOADING' } }, '*')
  },
  stopLoading: () => {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  },
}

const useAdminLoadingContext = () => useContext(AdminLoadingContext)

const AdminLoadingContextProvider: FunctionComponent = ({ children }) => (
  <AdminLoadingContext.Provider value={adminLoadingDefaultValue}>
    {children}
  </AdminLoadingContext.Provider>
)

export { AdminLoadingContextProvider, useAdminLoadingContext }
