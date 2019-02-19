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

const EditorHeader: React.SFC<Props> = ({
  isLoading,
  onClose,
  onSave,
  shouldDisableSaveButton = false,
  title,
}) => (
  <div className="w-100 flex items-center pl5 pt5 bt b--light-silver">
    <span className="pointer" onClick={onClose}>
      <IconArrowBack size={16} color="#585959" />
    </span>
    <div className="w-100 pl5 flex justify-between items-center">
      {title && (
        <h4 className="mv0 f6 fw5 dark-gray b--transparent ba bw1 pv3">
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
)

export default EditorHeader
