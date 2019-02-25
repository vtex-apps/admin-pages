import React, { useEffect } from 'react'
import { useEditorContext } from '../EditorContext'
import { useFormMetaContext } from './Sidebar/FormMetaContext'

interface Props {
  iframeRuntime: RenderContext | null
}

const maybeCall = (fn: (() => void) | void) => {
  if (typeof fn === 'function') {
    return fn()
  }
}

const IframeNavigationController: React.FunctionComponent<Props> = ({
  iframeRuntime,
}) => {
  const { wasModified, setWasModified } = useFormMetaContext()
  const { editExtensionPoint } = useEditorContext()

  useEffect(
    () => {
      let unblock: (() => void) | void
      let unlisten: (() => void) | void

      if (wasModified && iframeRuntime && iframeRuntime.history) {
        unblock = iframeRuntime.history.block('Are you sure you want to leave?')
        unlisten = iframeRuntime.history.listen((location, action) => {
          const hasNavigated = ['PUSH', 'REPLACE', 'POP'].includes(action)
          if (hasNavigated) {
            unblock = maybeCall(unblock)
            unlisten = maybeCall(unlisten)
            setWasModified(false)
            editExtensionPoint(null)
          }
        })
      }

      return () => {
        unblock = maybeCall(unblock)
        unlisten = maybeCall(unlisten)
      }
    },
    [wasModified]
  )

  return <></>
}

export default IframeNavigationController
