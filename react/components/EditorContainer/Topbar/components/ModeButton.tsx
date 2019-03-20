import React from 'react'
import { FormattedMessage } from 'react-intl'

import BackArrowIcon from './icons/BackArrowIcon'
import CustomizeIcon from './icons/CustomizeIcon'
import SettingsIcon from './icons/SettingsIcon'
import TemplateIcon from './icons/TemplateIcon'

interface Props {
  changeMode: (mode?: StoreEditMode) => void
  mode?: StoreEditMode
}

const icon = (mode?: StoreEditMode) => {
  switch (mode) {
    case 'settings':
      return <SettingsIcon />
    case 'theme':
      return <CustomizeIcon />
    case 'template':
      return <TemplateIcon />
    default:
      return <BackArrowIcon />
  }
}

const getTitle = (mode?: StoreEditMode) => {
  if (!mode) {
    return 'pages.editor.store.button.back.title'
  }

  return {
    [mode]: 'pages.editor.store.button.back.title',
    settings: 'pages.editor.store.button.settings.title',
    template: 'pages.editor.store.button.template.title',
    theme: 'pages.editor.store.button.theme.title',
  }[mode]
}

const ModeButton: React.SFC<Props> = ({ changeMode, mode }) => {
  return (
    <div
      className="pointer mh3 h-3em w4 flex justify-center items-center"
      onClick={() => changeMode(mode)}
    >
      {icon(mode)}
      <div className={`pl4 b mid-gray ${mode ? '' : 'c-action-primary'}`}>
        <FormattedMessage id={getTitle(mode)} />
      </div>
    </div>
  )
}

export default ModeButton
