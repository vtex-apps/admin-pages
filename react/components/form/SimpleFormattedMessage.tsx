import React from 'react'
import { FormattedMessage } from 'react-intl'

const SimpleFormattedMessage: React.SFC<{
  id: string;
}> = ({ id }) => (<FormattedMessage id={id}>{txt => <>{txt}</>}</FormattedMessage>)

export default SimpleFormattedMessage
