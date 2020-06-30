import React, { useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import StoreIframe from './components/EditorContainer/StoreIframe'
import EditorProvider from './components/EditorProvider'
import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface Props extends RenderContextProps {
  page: string
  params: {
    targetPath: string
  }
  query?: Record<string, string>[]
}

const PageEditor: React.FC<Props> = props => {
  const { page, params, query } = props

  const queryString =
    query === undefined || query === null
      ? ''
      : `?${Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`

  const runtime = useRuntime()

  if (page.includes('storefront')) {
    runtime.navigate({
      page: page.replace('storefront', 'site-editor'),
      params,
    })
  }

  const isSiteEditor = React.useMemo(() => page.includes('site-editor'), [page])

  const path = params?.targetPath && `${params.targetPath}${queryString ?? ''}`

  const { stopLoading } = useAdminLoadingContext()

  useEffect(() => {
    stopLoading()
  }, [stopLoading])

  return (
    <div className="h-100 overflow-y-auto bg-light-silver">
      <EditorProvider isSiteEditor={isSiteEditor}>
        <StoreIframe path={path} />
      </EditorProvider>
    </div>
  )
}

export default PageEditor
