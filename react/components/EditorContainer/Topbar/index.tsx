import React, { Fragment, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'
import EditableText from '../Sidebar/EditorHeader/EditableText'

import { useEditorContext } from '../../EditorContext'
import ModeButton from './components/ModeButton'

const modes: StoreEditMode[] = ['settings', 'theme']

interface Props {
  changeMode: (mode?: StoreEditMode) => void
  mode?: StoreEditMode
  urlPath: string
  onChangeUrlPath: (url: string) => void
  visible: boolean
}

const Topbar: React.FunctionComponent<Props> = ({
  changeMode,
  mode,
  onChangeUrlPath,
  urlPath,
  visible,
}) => {
  const [urlInputDisabled, setUrlInputDisabled] = useState(false)
  const [url, setUrl] = useState(urlPath)

  useEffect(
    () => {
      setUrl(urlPath)
    },
    [urlPath]
  )

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

  const handleUrlKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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
      <div className="flex items-stretch">
        {mode ? (
          <Fragment>
            <ModeButton changeMode={changeMode} mode={undefined} />
            <ModeButton changeMode={changeMode} mode={mode} />
          </Fragment>
        ) : (
          <Fragment>
            {modes.map(buttonMode => (
              <ModeButton
                key={buttonMode}
                changeMode={changeMode}
                mode={buttonMode}
              />
            ))}
            <div className="flex items-center mv4 pl5 bw1 bl b--muted-5">
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
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Topbar
