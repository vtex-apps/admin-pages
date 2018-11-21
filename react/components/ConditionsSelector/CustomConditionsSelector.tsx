import React from 'react'
import { injectIntl } from 'react-intl'

import MultiSelect from '../form/MultiSelect'

interface Option {
  label: string
  value: string
}

interface Props {
  autofocus?: boolean
  onChange: (newValue: string[]) => void
  options: Option[]
  value: string[]
}

const CustomConditionsSection: React.SFC<
  Props & ReactIntl.InjectedIntlProps
> = ({ intl, onChange, options, value }) => (
  <MultiSelect
    label={intl.formatMessage({
      id: 'pages.editor.components.conditions.custom.label',
    })}
    onChange={onChange}
    options={{ enumOptions: options }}
    placeholder={intl.formatMessage({
      id: 'pages.editor.components.conditions.custom.placeholder',
    })}
    value={value}
  />
)

export default injectIntl(CustomConditionsSection)
