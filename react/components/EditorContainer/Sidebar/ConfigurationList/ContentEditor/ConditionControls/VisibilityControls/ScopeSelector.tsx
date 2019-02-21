import React from 'react'
import { RadioGroup } from 'vtex.styleguide'

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  scope: ConfigurationScope
}

const ScopeSelector: React.SFC<Props> = ({ onChange, scope }) => (
  <RadioGroup
    name="scopes"
    onChange={onChange}
    options={[{ label: 'this', value: 'entity' }, { label: 'all', value: '*' }]}
    value={scope}
  />
)

export default ScopeSelector
