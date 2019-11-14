import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Tooltip } from 'vtex.styleguide'

import { useEditorContext } from '../../EditorContext'

import { useHover } from './hooks'
import IconPicker from './icons/IconPicker'

const BlockPicker: React.FC<InjectedIntlProps> = ({ intl }) => {
  const editor = useEditorContext()

  const { handleMouseEnter, handleMouseLeave, hover } = useHover()

  const handleEditModeToggle = editor.toggleEditMode

  const handleKeyPress = useKeydownFromClick(handleEditModeToggle)

  return (
    <Tooltip
      label={intl.formatMessage({
        defaultMessage: 'Select a block',
        id: 'admin/pages.editor.topbar.button.block-picker.tooltip',
      })}
      position="bottom"
    >
      <button
        className={`w2 h2 bg-white br2 b--transparent outline-0 pointer flex justify-center items-center ${
          editor.editMode || hover ? 'c-action-primary' : 'c-on-disabled'
        }`}
        onClick={handleEditModeToggle}
        onKeyPress={handleKeyPress}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <IconPicker />
      </button>
    </Tooltip>
  )
}

export default injectIntl(BlockPicker)
