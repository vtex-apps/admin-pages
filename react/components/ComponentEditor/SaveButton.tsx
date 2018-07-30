import React from 'react'
import { injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

type Props = {
  isLoading: boolean
  onClick: (event: Event) => void
  variation?: 'primary' | 'secondary' | 'tertiary'
}

const SaveButton = ({
  intl,
  isLoading = false,
  onClick,
  variation,
}: Props & ReactIntl.InjectedIntlProps) => (
  <Button
    isLoading={isLoading}
    onClick={onClick}
    size="small"
    variation={variation}
  >
    {intl.formatMessage({
      id: 'pages.editor.components.button.save',
    })}
  </Button>
)

export default injectIntl(SaveButton)
