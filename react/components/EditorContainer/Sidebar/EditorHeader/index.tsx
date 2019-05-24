import React from 'react'
import { IconArrowBack } from 'vtex.styleguide'

import SaveButton from './SaveButton'

interface Props {
  isLoading?: boolean
  onClose: () => void
  onSave?: () => void
  shouldDisableSaveButton?: boolean
  title?: string
}

const EditorHeader: React.FunctionComponent<Props> = ({
  isLoading,
  onClose,
  onSave,
  shouldDisableSaveButton = false,
  title,
}) => (
  <div className="w-100 ph5 pv4">
    <div className="w-100 flex justify-between">
      <div className={`flex items-center ${onSave ? 'w-100' : ''}`}>
        <span className="pointer" onClick={onClose}>
          <IconArrowBack size={16} color="#585959" />
        </span>
        <div className="w-100 pl3 flex justify-between items-center">
          {title && <h4 className="fw5 ma0 lh-copy f5 near-black">{title}</h4>}
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
    </div>
  </div>
)

export default EditorHeader
