import React, { Fragment } from 'react'

import CustomConditionsSelector from './CustomConditionsSelector'
import ScopeSelector from './ScopeSelector'

interface Props {
  onCustomConditionsChange: (newConditionsIds: string[]) => void
  onScopeChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    newScope: ConfigurationScope,
  ) => void
  scope?: ConfigurationScope
  selectedConditions: string[]
}

const ConditionsSelector = ({
  editor: { conditions, editTreePath },
  scope = 'route',
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
    // Only the second argument is used
    const mockEvent = {
      target: {
        value: 'route',
      },
    }
    onScopeChange(mockEvent as React.ChangeEvent<HTMLSelectElement>, 'route')
  }

  const shouldEnableCustomConditions = scope !== 'site'

  return (
    <Fragment>
      <ScopeSelector
        onChange={onScopeChange}
        shouldEnableSite={shouldEnableSite}
        value={scope}
      />
      {shouldEnableCustomConditions && (
        <div className="mt5">
          <CustomConditionsSelector
            onChange={onCustomConditionsChange}
            options={availableCustomConditions}
            value={selectedConditions}
          />
        </div>
      )}
    </Fragment>
  )
}

export default ConditionsSelector
