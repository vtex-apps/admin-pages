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
    return 'admin/pages.editor.store.button.back.title'
  }

  return {
    [mode]: 'admin/pages.editor.store.button.back.title',
    settings: 'admin/pages.editor.store.button.settings.title',
    template: 'admin/pages.editor.store.button.template.title',
    theme: 'admin/pages.editor.store.button.theme.title',
  }[mode]
}

const ModeButton: React.FunctionComponent<Props> = ({ changeMode, mode }) => {
  return (
    <div
      className="pointer h-3em flex justify-center items-center mr5"
      onClick={() => changeMode(mode)}
    >
      {icon(mode)}
      <div className={`pl3 b mid-gray fw5 ${mode ? '' : 'c-action-primary'}`}>
        <FormattedMessage id={getTitle(mode)} />
      </div>
    </div>
  )
}

export default ModeButton
