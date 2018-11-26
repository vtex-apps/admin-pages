import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

const SITE_SCOPE_CONDITION = {
  label: 'pages.conditions.scope.site',
  value: 'site',
}

const SCOPE_CONDITIONS = [
  {
    label: 'pages.conditions.scope.url',
    value: 'url',
  },
  {
    label: 'pages.conditions.scope.route',
    value: 'route',
  },
]

const getOptions = ({intl, shouldEnableSite}: {intl: InjectedIntl, shouldEnableSite: boolean}) => {
  const conditions = shouldEnableSite ? [...SCOPE_CONDITIONS, SITE_SCOPE_CONDITION] : SCOPE_CONDITIONS
  return conditions.map(option => ({
    ...option,
    label: option.label && intl.formatMessage({id: option.label}),
  }))
}

interface Props {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, value: ConfigurationScope) => void
  shouldEnableSite: boolean
  value: ConfigurationScope
}

const ScopeSelector = ({
  intl,
  onChange,
  shouldEnableSite,
  value,
}: Props & ReactIntl.InjectedIntlProps) => (
  <Dropdown
    label={intl.formatMessage({
      id: 'pages.editor.components.conditions.native.label',
    })}
    onChange={onChange}
    options={getOptions({intl, shouldEnableSite})}
    value={value}
  />
)

export default injectIntl(ScopeSelector)
