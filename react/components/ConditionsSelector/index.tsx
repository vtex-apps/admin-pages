import React, { Fragment } from 'react'

import CustomConditionsSelector from './CustomConditionsSelector'
import ScopeSelector from './ScopeSelector'

interface CustomProps {
  onCustomConditionsChange: (newConditionsIds: string[]) => void
  onScopeChange: (newScope: ConfigurationScope) => void
  page: RenderRuntime['page']
  pageContext: PageContext
  scope: ConfigurationScope
  selectedConditions: string[]
}

type Props = CustomProps & EditorContextProps

const ConditionsSelector = ({
  editor: { conditions, editTreePath },
  onCustomConditionsChange,
  onScopeChange,
  page,
  pageContext,
  scope,
  selectedConditions,
}: Props) => {
  const availableCustomConditions = conditions.map(condition => ({
    label: condition.conditionId,
    value: condition.conditionId,
  }))

  const shouldEnableSite = (editTreePath && !editTreePath.startsWith(page)) || false

  return (
    <Fragment>
      <ScopeSelector
        onChange={onScopeChange}
        pageContext={pageContext}
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
