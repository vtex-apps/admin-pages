import React, { useEffect, useMemo } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'

import StoreIframe from './components/EditorContainer/StoreIframe'
import EditorProvider from './components/EditorProvider'
import MessagesContext from './components/MessagesContext'
import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface Props extends RenderContextProps {
  page: string
  params: {
    targetPath: string
  }
}

let messages = {}

type ComponentWithCustomMessage = React.FunctionComponent<Props> & {
  getCustomMessages: () => object
}

const PageEditor: ComponentWithCustomMessage = (props: Props) => {
  const { page, params, runtime } = props

  if (page.includes('storefront')) {
    runtime.navigate({
      page: page.replace('storefront', 'site-editor'),
      params,
    })
  }

  const path = params && params.targetPath

  const messagesContextValue = useMemo(
    () => ({
      setMessages(newMessages?: object) {
        messages = newMessages || {}
      },
    }),
    []
  )

  const { stopLoading } = useAdminLoadingContext()

  useEffect(() => {
    stopLoading()
  }, [stopLoading])

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

export default withRuntimeContext(PageEditor)
