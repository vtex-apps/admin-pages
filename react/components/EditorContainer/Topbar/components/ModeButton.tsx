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

const ModeButton: React.SFC<Props> = ({ changeMode, mode }) => {
  return (
    <div
      className="pointer mh3 h-3em w4 flex justify-center items-center"
      onClick={() => changeMode(mode)}
    >
      {icon(mode)}
      <div className={`pl4 b mid-gray ${mode ? '' : 'c-action-primary'}`}>
        <FormattedMessage
          id={`pages.editor.store.button.${mode || 'back'}.title`}
        />
      </div>
    </div>
  )
}

export default ModeButton
