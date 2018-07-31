import React, { Fragment } from 'react'

import CustomConditionsSelector from './CustomConditionsSelector'
import ScopeSelector from './ScopeSelector'

interface Props {
  onCustomConditionsChange: (newConditionsIds: string[]) => void
  onScopeChange: (newScope: ConfigurationScope) => void
  scope?: ConfigurationScope
  selectedConditions: string[]
}

const ConditionsSelector = ({
  editor: { conditions, editTreePath },
  scope = 'url',
  onCustomConditionsChange,
  onScopeChange,
  selectedConditions,
  runtime: { page },
}: Props & EditorContextProps & RenderContextProps) => {
  const availableCustomConditions = conditions.map(condition => ({
    label: condition.conditionId,
    value: condition.conditionId,
  }))

  const shouldEnableSite =
    (editTreePath && !editTreePath.startsWith(page)) || false

  if (!shouldEnableSite && scope === 'site') {
    onScopeChange('url')
  }

  return (
    <Fragment>
      <ScopeSelector
        onChange={onScopeChange}
        shouldEnableSite={shouldEnableSite}
        value={scope}
      />
      <div className="mt5">
        <CustomConditionsSelector
          onChange={onCustomConditionsChange}
          options={availableCustomConditions}
          value={selectedConditions}
        />
      </div>
    </Fragment>
  )
}

export default ConditionsSelector
