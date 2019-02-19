import React from 'react'
import { injectIntl } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'

import AddIcon from '../../../../icons/AddIcon'

interface Props {
  onClick: (event: Event) => void
}

const CreateButton = ({
  intl,
  onClick,
}: Props & ReactIntl.InjectedIntlProps) => (
  <div className="mh5 mt5">
    <ButtonWithIcon
      block
      icon={<AddIcon />}
      onClick={onClick}
      variation="tertiary"
    >
      {intl.formatMessage({
        id: 'pages.editor.components.configurations.button.create',
      })}
    </ButtonWithIcon>
  </div>
)

export default injectIntl(CreateButton)
