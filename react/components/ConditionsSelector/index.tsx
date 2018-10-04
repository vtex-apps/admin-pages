import React, { Fragment } from 'react'

import CustomConditionsSelector from './CustomConditionsSelector'
import ScopeSelector from './ScopeSelector'

interface CustomProps {
  context: PageContext
  onCustomConditionsChange: (newConditionsIds: string[]) => void
  onScopeChange: (newScope: ConfigurationScope) => void
  scope: ConfigurationScope
  selectedConditions: string[]
}

type Props = CustomProps & EditorContextProps

const ConditionsSelector = ({
  context,
  editor: { conditions },
  onCustomConditionsChange,
  onScopeChange,
  scope,
  selectedConditions,
}: Props) => {
  const availableCustomConditions = conditions.map(condition => ({
    label: condition.conditionId,
    value: condition.conditionId,
  }))

  return (
    <Fragment>
      <ScopeSelector context={context} onChange={onScopeChange} value={scope} />
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
