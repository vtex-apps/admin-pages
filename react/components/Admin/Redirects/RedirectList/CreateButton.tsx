import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface CustomProps {
  onClick: () => void
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const CreateButton = ({ onClick }: Props) => (
  <Button onClick={onClick} size="small" variation="primary">
    <FormattedMessage id="pages.admin.redirects.button.create" />
  </Button>
)

export default injectIntl(CreateButton)
