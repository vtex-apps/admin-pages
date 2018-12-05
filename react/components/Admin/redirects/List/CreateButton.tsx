import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface Props {
  onClick: () => void
}

const CreateButton = ({ onClick }: Props) => (
  <Button onClick={onClick} size="small" variation="primary">
    <FormattedMessage id="pages.admin.redirects.button.create" />
  </Button>
)

export default CreateButton
