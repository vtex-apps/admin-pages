import React, { ComponentType, useContext } from 'react'

export interface TargetPathContextProps {
  targetPath: string
  setTargetPath: (s: string) => void
}

const TargetPathContext = React.createContext({
  setTargetPath: (s: string) => {
    //
  },
  targetPath: '',
})
const useTargetPathContext = () => useContext(TargetPathContext)

const withTargetPath = <TOriginalProps extends {} = {}>(
  Component: ComponentType<TOriginalProps & TargetPathContextProps>
): ComponentType<TOriginalProps> => {
  const extendedComponent = (props: TOriginalProps) => (
    <TargetPathContext.Consumer>
      {({ setTargetPath, targetPath }) => {
        return (
          <Component
            {...props}
            setTargetPath={setTargetPath}
            targetPath={targetPath}
          />
        )
      }}
    </TargetPathContext.Consumer>
  )
  return extendedComponent
}

export { useTargetPathContext, withTargetPath }
export default TargetPathContext
