import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

// import DateSelector from './DateSelector'
import ScopeSelector from './ScopeSelector'

interface Props {
  condition: ExtensionConfiguration['condition']
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  pageContext: RenderRuntime['route']['pageContext']
  shouldEnableSitewide: boolean
}

class ConditionControls extends Component<Props> {
  public render() {
    const { condition, pageContext, shouldEnableSitewide } = this.props

    const scope =
      condition.pageContext.type === '*'
        ? 'sitewide'
        : condition.pageContext.id === '*'
        ? 'generic'
        : 'specific'

    return (
      <Fragment>
        <FormattedMessage id="pages.editor.components.condition.title">
          {message => (
            <div className="mv5 pt5 ph5 bt bw1 b--light-silver flex items-center f4">
              {message}
            </div>
          )}
        </FormattedMessage>
        <div className="mv5 bt bw1 b--light-silver">
          <div className="pa5">
            <ScopeSelector
              onChange={this.handleScopeChange}
              pageContext={pageContext}
              scope={scope}
              shouldEnableSitewide={shouldEnableSitewide}
            />
          </div>
          {/* <div className="pt5 ph5 bb b--light-silver">
          <DateSelector date={undefined} onChange={this.handleDateChange} />
        </div> */}
        </div>
      </Fragment>
    )
  }

  private getPageContextFromScope(scope: ConfigurationScope): PageContext {
    const { pageContext } = this.props

    if (scope === 'sitewide') {
      return { id: '*', type: '*' }
    }

    if (scope === 'generic') {
      return { id: '*', type: pageContext.type }
    }

    return pageContext
  }

  // private handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (something) {
  //     onConditionChange({ something })
  //   }
  // }

  private handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { condition, onConditionChange } = this.props

    const newPageContext = this.getPageContextFromScope(event.target
      .value as ConfigurationScope)

    if (
      newPageContext.id !== condition.pageContext.id ||
      newPageContext.type !== condition.pageContext.type
    ) {
      onConditionChange({
        pageContext: newPageContext,
      })
    }
  }
}

export default ConditionControls
