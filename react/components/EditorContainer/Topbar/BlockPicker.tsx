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
  )
}

export default BlockPicker
