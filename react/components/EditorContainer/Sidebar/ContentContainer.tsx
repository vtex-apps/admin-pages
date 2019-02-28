import classnames from 'classnames'
import React from 'react'
import { Spinner } from 'vtex.styleguide'

interface Props {
  children: React.ReactNode
  containerClassName?: string
  isLoading: boolean
}

const ContentContainer: React.FunctionComponent<Props> = ({
  children,
  containerClassName,
  isLoading,
}) => (
  <div className={classnames('relative', containerClassName)}>
    {isLoading ? (
      <div className="absolute bg-white-70 flex h-100 justify-center pt9 w-100 z-2">
        <Spinner />
      </div>
    ) : null}
    {children}
  </div>
)

export default React.memo(ContentContainer)
