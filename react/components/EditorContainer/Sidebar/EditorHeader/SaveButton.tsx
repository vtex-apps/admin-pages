import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface Props {
  isDisabled?: boolean
  isLoading: boolean
  onClick: (event: Event) => void
  variation?: 'primary' | 'secondary' | 'tertiary'
}

const SaveButton = ({
  isDisabled = false,
  isLoading = false,
  onClick,
  variation,
}: Props) => (
  <div className="nv3">
    <Button
      disabled={isDisabled}
      isLoading={isLoading}
      onClick={onClick}
      size="small"
      variation={variation}
    >
      <FormattedMessage
        id="admin/pages.editor.components.button.save"
        defaultMessage="Save"
      />
    </Button>
  </div>
)

export default SaveButton
