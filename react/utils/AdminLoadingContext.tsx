import React, { FunctionComponent, useContext } from 'react'

const adminLoadingDefaultValue = {
  startLoading: () => {
    window.top.postMessage({ action: { type: 'START_LOADING' } }, '*')
  },
  stopLoading: () => {
    window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  },
}

const AdminLoadingContext = React.createContext(adminLoadingDefaultValue)

const useAdminLoadingContext = () => useContext(AdminLoadingContext)

const AdminLoadingContextProvider: FunctionComponent = ({ children }) => (
  <AdminLoadingContext.Provider value={adminLoadingDefaultValue}>
    {children}
  </AdminLoadingContext.Provider>
)

export { AdminLoadingContextProvider, useAdminLoadingContext }
