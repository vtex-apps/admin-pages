import React from 'react'
import { injectIntl } from 'react-intl'
import { Input } from 'vtex.styleguide'

interface Props {
  onChange: (event: Event) => void
  value?: string
}

const LabelEditor = ({
  intl,
  onChange,
  value = '',
}: Props & ReactIntl.InjectedIntlProps) => (
  <Input
    label={intl.formatMessage({
      id: 'admin/pages.editor.components.labelEditor.label',
    })}
    onChange={onChange}
    value={value}
  />
)

export default injectIntl(LabelEditor)
