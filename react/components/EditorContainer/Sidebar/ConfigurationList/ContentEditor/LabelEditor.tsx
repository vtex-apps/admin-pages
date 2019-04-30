import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Input } from 'vtex.styleguide'

interface Props {
  onChange: (event: Event) => void
  value: string
}

const messages = defineMessages({
  label: {
    defaultMessage: 'Configuration name',
    id: 'admin/pages.editor.components.labelEditor.label',
  },
})

const LabelEditor = ({
  intl,
  onChange,
  value,
}: Props & ReactIntl.InjectedIntlProps) => (
  <Input
    label={intl.formatMessage(messages.label)}
    onChange={onChange}
    value={value}
  />
)

LabelEditor.defaultProps = {
  value: '',
}

export default React.memo(injectIntl(LabelEditor))
