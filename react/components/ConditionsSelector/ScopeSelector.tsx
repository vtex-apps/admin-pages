import React from 'react'
import { injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

interface CustomProps {
  onChange: (value: ConfigurationScope) => void
  pageContext: PageContext
  value: ConfigurationScope
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const URL_OPTIONS = [
  {
    label: 'pages.conditions.scope.url',
    value: 'url',
  },
]

const ScopeSelector = ({ intl, onChange, pageContext, value }: Props) => {
  const isUrl = pageContext.type === 'url'

  const enumOptions = isUrl
    ? URL_OPTIONS
    : [
        {
          label: `pages.conditions.scope.${pageContext.type}.routeGeneric`,
          value: 'routeGeneric',
        },
        {
          label: `pages.conditions.scope.${pageContext.type}.routeSpecific`,
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
