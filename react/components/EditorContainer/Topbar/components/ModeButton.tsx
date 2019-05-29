import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

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

const messages = defineMessages({
  back: {
    defaultMessage: 'Back to editor',
    id: 'admin/pages.editor.store.button.back.title',
  },
  settings: {
    defaultMessage: 'Store',
    id: 'admin/pages.editor.store.button.settings.title',
  },
  template: {
    defaultMessage: 'Template',
    id: 'admin/pages.editor.store.button.template.title',
  },
  theme: {
    defaultMessage: 'Design',
    id: 'admin/pages.editor.store.button.theme.title',
  },
})

const getTitle = (mode?: StoreEditMode) => {
  if (!mode) {
    return messages.back
  }

  return messages[mode]
}

const ModeButton: React.FunctionComponent<Props> = ({ changeMode, mode }) => {
  return (
    <div
      className="pointer h-3em flex justify-center items-center mr5"
      onClick={() => changeMode(mode)}
    >
      {icon(mode)}
      <div className={`pl3 b mid-gray fw5 ${mode ? '' : 'c-action-primary'}`}>
        <FormattedMessage {...getTitle(mode)} />
      </div>
    </div>
  )
}

export default ModeButton
