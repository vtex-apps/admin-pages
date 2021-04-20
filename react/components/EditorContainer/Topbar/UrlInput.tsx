import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useEditorContext } from '../../EditorContext'

const UrlInput = () => {
  const [urlInputDisabled, setUrlInputDisabled] = React.useState(false)

  const editor = useEditorContext()

  const resolveUrlPath = (pathname: string, searchQueries: string) => {
    const searchParams = new URLSearchParams(searchQueries)
    const SEARCH_QUERIES_TO_HIDE = [
      '__siteEditor',
      '__bindingAddress',
      '__locale',
    ]

    SEARCH_QUERIES_TO_HIDE.forEach(query => {
      searchParams.delete(query)
    })

    if (searchParams.toString().length) {
      return pathname + decodeURIComponent(`?${searchParams.toString()}`)
    }

    return pathname
  }

  const urlPath = editor.iframeWindow
    ? resolveUrlPath(
        editor.iframeWindow.location.pathname,
        editor.iframeWindow.location.search
      )
    : ''

  const [url, setUrl] = React.useState(urlPath)

  React.useEffect(() => {
    setUrl(urlPath)
  }, [urlPath])

  const onEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
    callback: () => void
  ) => event.key === 'Enter' && callback()

  const handleNavigateToUrl = () => {
    if (url === urlPath) {
      return
    }

    setUrlInputDisabled(true)

    editor.onChangeIframeUrl(url)
  }

  const handleUrlKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    onEnter(e, handleNavigateToUrl)
  }

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetUrl = e.target.value
    if (targetUrl === url) {
      return
    }
    setUrl(targetUrl)
  }

  return (
    <div className="w-100 h2 pl5 bg-white ba bw1 br2 b--muted-4 hover-b--muted-3 flex items-center">
      <FormattedMessage
        defaultMessage="URL"
        id="admin/pages.editor.container.editpath.label"
      >
        {message => (
          <label
            className="c-muted-2"
            htmlFor="topbar-url-input"
            style={{ userSelect: 'none' }}
          >
            {message}
          </label>
        )}
      </FormattedMessage>

      <input
        className="w-100 pl3 bn outline-0"
        disabled={urlInputDisabled}
        id="topbar-url-input"
        onBlur={handleNavigateToUrl}
        onChange={handleChangeUrl}
        onKeyPress={handleUrlKeyPress}
        value={url}
      />
    </div>
  )
}

export default UrlInput
