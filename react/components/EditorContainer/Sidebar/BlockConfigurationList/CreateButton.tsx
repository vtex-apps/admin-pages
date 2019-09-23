import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'

import AddIcon from '../../../icons/AddIcon'

interface Props {
  onClick: (event: Event) => void
}

const CreateButton = ({ onClick }: Props) => (
  <div className="mh5 ba b--muted-4 br2">
    <ButtonWithIcon
      block
      icon={<AddIcon />}
      onClick={onClick}
      variation="tertiary"
    >
      <FormattedMessage
        defaultMessage="New content"
        id="admin/pages.editor.configuration.button.create"
      />
    </ButtonWithIcon>
  </div>
)

export default React.memo(CreateButton)
