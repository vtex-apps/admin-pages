import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'

import AddIcon from '../icons/AddIcon'

interface Props {
  onClick: (event: Event) => void
}

const AddButton: React.FC<Props> = ({ onClick }) => (
  <div className="ba b--muted-4 br2 mb3">
    <ButtonWithIcon
      block
      icon={<AddIcon />}
      onClick={onClick}
      variation="tertiary"
    >
      <FormattedMessage
        defaultMessage="Add"
        id="admin/pages.editor.components.arrayTemplate.button.add"
      >
        {text => <div className="mv3">{text}</div>}
      </FormattedMessage>
    </ButtonWithIcon>
  </div>
)

export default AddButton
