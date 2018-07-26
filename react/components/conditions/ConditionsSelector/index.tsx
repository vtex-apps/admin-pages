import React, { Fragment } from 'react'

import CustomConditionsSelector from './CustomConditionsSelector'
import ScopeSelector from './ScopeSelector'

interface ConditionsSelectorProps {
  editor: EditorContext
  onChangeCustomConditions: (newConditionsIds: string[]) => void
  onChangeScope: (newScope: ConfigurationScope) => void
  scope: ConfigurationScope
  selectedConditions: string[]
  runtime: RenderContext
}

const ConditionsSelector: React.StatelessComponent<ConditionsSelectorProps> = ({
  editor: {
    conditions,
    editTreePath,
  },
  scope,
  onChangeCustomConditions,
  onChangeScope,
  selectedConditions,
  runtime: { page },
}) => {
  const availableCustomConditions = conditions.map(condition => ({
    label: condition.conditionId,
    value: condition.conditionId,
  }))

  const shouldEnableSite = editTreePath && !editTreePath.startsWith(page) || false

  if (!shouldEnableSite && scope === 'site') {
    onChangeScope('url')
  }

  return (
    <Fragment>
      <div className="ph5 mb5">
        <ScopeSelector
          onChange={onChangeScope}
          shouldEnableSite={shouldEnableSite}
          value={scope}
        />
      </div>
      <div className="ph5 mb5">
        <CustomConditionsSelector
          onChange={onChangeCustomConditions}
          options={availableCustomConditions}
          value={selectedConditions}
        />
      </div>
    </Fragment>
  )
}

export default ConditionsSelector
