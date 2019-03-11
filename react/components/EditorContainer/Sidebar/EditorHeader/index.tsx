import React from 'react'
import { IconArrowBack } from 'vtex.styleguide'

import GearIcon from '../../../icons/GearIcon'

import SaveButton from './SaveButton'

interface Props {
  editor?: EditorContext
  isLoading?: boolean
  onClose: () => void
  onSave?: () => void
  shouldDisableSaveButton?: boolean
  title?: string
}

const EditorHeader: React.SFC<Props> = ({
  editor,
  isLoading,
  onClose,
  onSave,
  shouldDisableSaveButton = false,
  title,
}) => (
  <div
    className={`w-100 pl5 pv4  bb bw1 b--light-silver pr5 ${
      !onSave ? 'pr5' : ''
    }`}
  >
    <div className="w-100 flex justify-between">
      <div className={`flex items-center ${onSave ? 'w-100' : ''}`}>
        <span className="pointer" onClick={onClose}>
          <IconArrowBack size={16} color="#585959" />
        </span>
        <div className="w-100 pl3 mv1 flex justify-between items-center">
          {title && (
            <h4 className="mv0 f6 fw5 dark-gray b--transparent ba bw1">
              {title}
            </h4>
          )}
          {onSave && (
            <SaveButton
              isDisabled={shouldDisableSaveButton}
              isLoading={isLoading || false}
              onClick={onSave}
              variation="tertiary"
            />
          )}
        </div>
      </div>
      {!onSave && editor && (
        <div
          className="flex items-center pointer"
          onClick={() => {
            if (editor.mode !== 'layout') {
              editor.setMode('layout')
            }
          }}
        >
          <GearIcon />
        </div>
      )}
    </div>
  </div>
)

export default EditorHeader
