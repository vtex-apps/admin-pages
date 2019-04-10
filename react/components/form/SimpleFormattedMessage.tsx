import React from 'react'
import { FormattedMessage } from 'react-intl'

const SimpleFormattedMessage: React.FunctionComponent<{
  id: string
}> = ({ id }) => (
  <FormattedMessage id={id}>{txt => <>{txt}</>}</FormattedMessage>
)

export default SimpleFormattedMessage
