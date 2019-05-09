import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'

import AddIcon from '../../../../icons/AddIcon'

interface Props {
  onClick: (event: Event) => void
}

const CreateButton = ({ onClick }: Props) => (
  <div className="mh5 mt5">
    <ButtonWithIcon
      block
      icon={<AddIcon />}
      onClick={onClick}
      variation="tertiary"
    >
      <FormattedMessage
        id="admin/pages.editor.components.configurations.button.create"
        defaultMessage="Add content"
      />
    </ButtonWithIcon>
  </div>
)

export default React.memo(CreateButton)
