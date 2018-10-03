import React from 'react'
import { injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

interface CustomProps {
  onChange: (value: ConfigurationScope) => void
  value: ConfigurationScope
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const options = {
  enumOptions: [
    {
      label: 'pages.conditions.scope.url',
      value: 'url',
    },
    {
      label: 'pages.conditions.scope.route',
      value: 'route',
    },
  ],
}

const ScopeSelector = ({ intl, onChange, value }: Props) => (
  <Dropdown
    label={intl.formatMessage({
      id: 'pages.editor.components.conditions.native.label',
    })}
    onChange={onChange}
    options={options}
    value={value}
  />
)

export default injectIntl(ScopeSelector)
