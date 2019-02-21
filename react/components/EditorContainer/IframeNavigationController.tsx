import React, { useEffect } from 'react'
import { useEditorContext } from '../EditorContext'
import { useFormMetaContext } from './Sidebar/FormMetaContext'

interface Props {
  iframeRuntime: RenderContext | null
}

const IframeNavigationController: React.FunctionComponent<Props> = ({
  iframeRuntime,
}) => {
  const { wasModified } = useFormMetaContext()
  const { editExtensionPoint } = useEditorContext()

  useEffect(
    () => {
      let unblock: any
      let unlisten: any
      if (wasModified && iframeRuntime && iframeRuntime.history) {
        unblock = iframeRuntime.history.block('Are you sure you want to leave?')
        unlisten = iframeRuntime.history.listen((location, action) => {
          const hasNavigated = ['PUSH', 'REPLACE', 'POP'].includes(action)
          if (hasNavigated) {
            editExtensionPoint(null)
          }
        })
      }

      return () => {
        if (typeof unblock === 'function') {
          unblock()
        }

        if (typeof unlisten === 'function') {
          unlisten()
        }
      }
    },
    [wasModified]
  )

  return <></>
}

export default IframeNavigationController
