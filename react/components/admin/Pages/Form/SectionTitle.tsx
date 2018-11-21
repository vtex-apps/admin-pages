import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  textId: string
}

const SectionTitle: React.SFC<Props> = ({ textId }) => (
  <FormattedMessage id={textId}>
    {text => <h2 className="mv7 f5 normal">{text}</h2>}
  </FormattedMessage>
)

export default SectionTitle
