import React, { useEffect } from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { useEditorContext } from '../EditorContext'
import { useFormMetaContext } from './Sidebar/FormMetaContext'

interface Props extends InjectedIntlProps {
  iframeRuntime: RenderContext | null
}

const maybeCall = (fn: (() => void) | void) => {
  if (typeof fn === 'function') {
    return fn()
  }
}

const messages = defineMessages({
  confirm: {
    defaultMessage: 'Are you sure you want to leave?',
    id: 'admin/pages.editor.iframe.confirm-prompt',
  },
})

const IframeNavigationController: React.FunctionComponent<Props> = ({
  iframeRuntime,
  intl,
}) => {
  const { getWasModified, setWasModified } = useFormMetaContext()
  const { editExtensionPoint } = useEditorContext()

  const wasModified = getWasModified()

  useEffect(() => {
    let unblock: (() => void) | void
    let unlisten: (() => void) | void

    if (wasModified && iframeRuntime && iframeRuntime.history) {
      unblock = iframeRuntime.history.block(
        intl.formatMessage(messages.confirm)
      )
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
  }, [editExtensionPoint, iframeRuntime, setWasModified, wasModified, intl])

  return null
}

export default injectIntl(IframeNavigationController)
