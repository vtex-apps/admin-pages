import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

import { LabelledLocale } from '../../DomainMessages'
import EditableText from '../EditableText'

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
        <div className="flex items-center mv4 pl5 bw1 bl b--muted-5">
          <Dropdown
            variation="inline"
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
        <div className="flex items-center flex-grow-1 mv4 pl5 bw1 bl b--muted-5">
          <div className="nowrap">
            <FormattedMessage id="admin/pages.editor.container.editpath.label" />
          </div>
          <EditableText
            baseClassName="w-100 pl3 c-muted-2"
            onChange={handleChangeUrl}
            onBlur={handleNavigateToUrl}
            onKeyPress={handleUrlKeyPress}
            disabled={urlInputDisabled}
            value={url}
          />
        </div>
      </div>
    </div>
  )
}

export default Topbar
