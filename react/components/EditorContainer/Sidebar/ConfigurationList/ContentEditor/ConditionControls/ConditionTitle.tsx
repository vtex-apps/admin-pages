import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  labelId: string
}

const ConditionTitle: React.FunctionComponent<Props> = ({ labelId }) => (
  <FormattedMessage id={labelId}>
    {message => <div className="mb6">{message}</div>}
  </FormattedMessage>
)

export default ConditionTitle
