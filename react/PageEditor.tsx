import PropTypes from 'prop-types'
import React, { Component, useEffect, useMemo } from 'react'

import StoreIframe from './components/EditorContainer/StoreIframe'
import EditorProvider from './components/EditorProvider'
import MessagesContext, { IMessagesContext } from './components/MessagesContext'
import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface PageEditorProps {
  params: {
    targetPath: string
  }
}

let messages = {}

type ComponentWithCustomMessage = React.FunctionComponent<PageEditorProps> & {
  getCustomMessages: () => object
}

const PageEditor: ComponentWithCustomMessage = (props: PageEditorProps) => {
  const { params } = props

  const path = params && params.targetPath

  const messagesContextValue = useMemo(
    () => ({
      setMessages(newMessages?: object) {
        messages = {
          ...messages,
          ...newMessages,
        }
      },
    }),
    []
  )

  const { stopLoading } = useAdminLoadingContext()

  useEffect(() => {
    stopLoading()
  }, [])

  return (
    <div className="h-100 overflow-y-auto bg-light-silver">
      <MessagesContext.Provider value={messagesContextValue}>
        <EditorProvider>
          <StoreIframe path={path} />
        </EditorProvider>
      </MessagesContext.Provider>
    </div>
  )
}

PageEditor.getCustomMessages = () => messages

export default PageEditor
