import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  title?: string
}

const FieldTitle: React.FunctionComponent<Props> = ({ title }) =>
  title ? (
    <FormattedMessage id={title}>
      {text => <span className="w-100 db mb3">{text}</span>}
    </FormattedMessage>
  ) : null

export default FieldTitle
