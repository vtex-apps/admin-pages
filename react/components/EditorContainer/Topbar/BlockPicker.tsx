import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'

import { useEditorContext } from '../../EditorContext'

import { useHover } from './hooks'
import IconPicker from './icons/IconPicker'

const BlockPicker = () => {
  const editor = useEditorContext()

  const { handleMouseEnter, handleMouseLeave, hover } = useHover()

  const handleEditModeToggle = editor.toggleEditMode

  const handleKeyPress = useKeydownFromClick(handleEditModeToggle)

  return (
    <div
      className={`w2 h2 bg-white br2 outline-0 pointer flex justify-center items-center ${
        editor.editMode || hover ? 'c-action-primary' : 'c-on-disabled'
      }`}
      onClick={handleEditModeToggle}
      onKeyPress={handleKeyPress}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
    >
      <IconPicker />
    </div>
  )
}

export default BlockPicker
