import React from 'react'
import { injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface Props {
  onClick: (event: Event) => void
}

const CreateButton = ({
  intl,
  onClick,
}: Props & ReactIntl.InjectedIntlProps) => (
  <div className="mh5 mt5">
    <Button block onClick={onClick} variation="tertiary">
      {intl.formatMessage({
        id: 'pages.editor.components.configurations.button.create',
      })}
    </Button>
  </div>
)

export default injectIntl(CreateButton)
