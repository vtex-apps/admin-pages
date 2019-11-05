import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

import { LabelledLocale } from '../../DomainMessages'

interface Props {
  availableCultures: LabelledLocale[]
  iframeRuntime: RenderContext
  urlPath: string
  onChangeUrlPath: (url: string) => void
  visible: boolean
}

const Topbar: React.FunctionComponent<Props> = ({
  availableCultures,
  iframeRuntime,
  onChangeUrlPath,
  urlPath,
  visible,
}) => {
  const [urlInputDisabled, setUrlInputDisabled] = useState(false)
  const [url, setUrl] = useState(urlPath)
  const [locale, setLocale] = useState(iframeRuntime.culture.locale)

  useEffect(() => {
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
    onChangeUrlPath(url)
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
    <div
      className={
        visible ? 'ph5 f6 h-3em w-100 flex justify-between items-center' : 'dn'
      }
    >
      <div className="flex items-stretch w-100">
        <div className="flex items-center mv4 pl5">
          <Dropdown
            size="small"
            options={availableCultures}
            value={locale}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const { emitter } = iframeRuntime
              setLocale(e.target.value)
              emitter.emit('localesChanged', e.target.value)
            }}
          />
        </div>

        <div className="ml6 mv4 pl5 bg-white ba bw1 br2 b--muted-4 hover-b--muted-3 flex items-center flex-grow-1">
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
      </div>
    </div>
  )
}

export default Topbar
