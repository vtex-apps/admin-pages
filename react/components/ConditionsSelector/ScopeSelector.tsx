import React from 'react'
import { injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

interface CustomProps {
  context: PageContext
  onChange: (value: ConfigurationScope) => void
  value: ConfigurationScope
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const URL_OPTIONS = [
  {
    label: 'pages.conditions.scope.url',
    value: 'url',
  },
]

const ScopeSelector = ({ context, intl, onChange, value }: Props) => {
  const isUrl = context.type === 'url'

  const enumOptions = isUrl
    ? URL_OPTIONS
    : [
        {
          label: `pages.conditions.scope.${context.type}.routeGeneric`,
          value: 'routeGeneric',
        },
        {
          label: `pages.conditions.scope.${context.type}.routeSpecific`,
          value: 'routeSpecific',
        },
      ]

  return (
    <Dropdown
      disabled={isUrl}
      label={intl.formatMessage({
        id: 'pages.editor.components.conditions.native.label',
      })}
      onChange={onChange}
      options={{
        enumOptions,
      }}
      value={value}
    />
  )
}

export default injectIntl(ScopeSelector)
