import classnames from 'classnames'
import React from 'react'
import { Spinner } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'

interface Props {
  children: React.ReactNode
  containerClassName?: string
  id?: string
}

const LoaderContainer: React.FunctionComponent<Props> = ({
  children,
  containerClassName,
  id,
}) => {
  const editor = useEditorContext()

  const isLoading = editor.getIsLoading()

  return (
    <>
      {isLoading ? (
        <div className="absolute bg-white-70 flex items-center h-100 justify-center w-100 z-2">
          <Spinner />
        </div>
      ) : null}

      <div id={id} className={classnames('relative', containerClassName)}>
        {children}
      </div>
    </>
  )
}

export default React.memo(LoaderContainer)
