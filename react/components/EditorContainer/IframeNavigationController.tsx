import React, { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'
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

function getConfirmationMessage(language: string) {
  const messages: Record<string, string> = {
    en: 'Are you sure you want to leave?',
    es: 'Estás seguro que quieres irte?',
    pt: 'Tem certeza que deseja sair?',
  }
  return messages[language] || messages.en
}

const IframeNavigationController: React.FunctionComponent<Props> = ({
  iframeRuntime,
}) => {
  const {
    culture: { language },
  } = useRuntime()
  const { getWasModified, setWasModified } = useFormMetaContext()
  const { editExtensionPoint } = useEditorContext()

  const wasModified = getWasModified()

  useEffect(() => {
    let unblock: (() => void) | void
    let unlisten: (() => void) | void

    if (wasModified && iframeRuntime && iframeRuntime.history) {
      unblock = iframeRuntime.history.block(getConfirmationMessage(language))
      unlisten = iframeRuntime.history.listen((_, action) => {
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
  }, [editExtensionPoint, iframeRuntime, language, setWasModified, wasModified])

  return null
}

export default IframeNavigationController
