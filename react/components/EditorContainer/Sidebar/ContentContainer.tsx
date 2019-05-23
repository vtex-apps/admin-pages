import classnames from 'classnames'
import React from 'react'
import { Spinner } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'

interface Props {
  centerSpinner?: boolean
  children: React.ReactNode
  containerClassName?: string
}

const ContentContainer: React.FunctionComponent<Props> = ({
  centerSpinner,
  children,
  containerClassName,
}) => {
  const { isLoading } = useEditorContext()

  return (
    <div className={classnames('relative', containerClassName)}>
      {isLoading ? (
        <div
          className={`absolute bg-white-70 flex h-100 justify-center pt9 w-100 z-2 ${
            centerSpinner ? 'items-center' : ''
          }`}
        >
          <Spinner />
        </div>
      ) : null}
      {children}
    </div>
  )
}

export default React.memo(ContentContainer)
