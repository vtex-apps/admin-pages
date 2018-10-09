import React from 'react'
import { injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

interface CustomProps {
  onChange: (value: ConfigurationScope) => void
  pageContext: PageContext
  shouldEnableSite: boolean
  value: ConfigurationScope
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const SITE_OPTION = {
  label: 'pages.conditions.scope.site',
  value: 'site',
}

const URL_OPTIONS = [
  {
    label: 'pages.conditions.scope.url',
    value: 'url',
  },
]

const ScopeSelector = ({
  intl,
  onChange,
  pageContext,
  shouldEnableSite,
  value,
}: Props) => {
  const isUrl = pageContext.type === 'url'

  const partialEnumOptions = isUrl
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

  const enumOptions = shouldEnableSite
    ? [SITE_OPTION, ...partialEnumOptions]
    : partialEnumOptions

  return (
    <Dropdown
      disabled={enumOptions.length === 1}
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
