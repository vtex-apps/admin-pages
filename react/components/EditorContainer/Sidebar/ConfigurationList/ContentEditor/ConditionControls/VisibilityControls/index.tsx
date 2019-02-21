import React, { Component } from 'react'

import DateSelector from './DateSelector'
import ScopeSelector from './ScopeSelector'

interface Props {
  condition: ExtensionConfiguration['condition']
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
}

class VisibilityControls extends Component<Props> {
  public render() {
    const { condition } = this.props

    const scope =
      condition.pageContext.id === '*' ? condition.pageContext.id : 'entity'

    const shouldRenderScopeSelector = condition.pageContext.type !== 'route'

    return (
      <div className="mt5">
        {shouldRenderScopeSelector && (
          <div className="pb5 bb b--light-silver">
            <ScopeSelector onChange={this.handleScopeChange} scope={scope} />
          </div>
        )}
        {/* <div className="pb5 bb b--light-silver">
          <DateSelector date={undefined} onChange={this.handleDateChange} />
        </div> */}
      </div>
    )
  }

  private handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (something) {
    //   onConditionChange({ something })
    // }
  }

  private handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { condition, onConditionChange } = this.props

    if (condition.pageContext.id !== event.target.value) {
      onConditionChange({
        pageContext: {
          id: event.target.value,
          type: condition.pageContext.type,
        },
      })
    }
  }
}

export default VisibilityControls
