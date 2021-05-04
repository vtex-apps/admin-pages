import React, { PureComponent } from 'react'

import { ConfigurationStatus } from '../..'
import { formatStatements } from '../../../../../../utils/conditions'
import { isUnidentifiedPageContext } from '../../../utils'
import Scheduler from './Scheduler'
import ScopeSelector from './ScopeSelector'
import Separator from './Separator'
import Typings from './typings'

interface Props {
  condition: ExtensionConfiguration['condition']
  isSitewide: boolean
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  pageContext: RenderRuntime['route']['pageContext']
  statusFromRuntime: ConfigurationStatus
  status: ConfigurationStatus
}

class ConditionControls extends PureComponent<Props> {
  private isScopeDisabled =
    this.props.isSitewide || isUnidentifiedPageContext(this.props.pageContext)

  public render() {
    const { condition, isSitewide, pageContext, status } = this.props

    const scope = isSitewide
      ? 'sitewide'
      : condition.pageContext.id === '*'
      ? 'template'
      : 'entity'

    return (
      <div className="ph5">
        <Scheduler
          status={status}
          onConditionUpdate={this.handleDateChange}
          initialValues={this.getDatesInitialValues()}
        />

        <div className="mv7">
          <ScopeSelector
            isDisabled={this.isScopeDisabled}
            isSitewide={isSitewide}
            onChange={this.handleScopeChange}
            pageContext={pageContext}
            scope={scope}
          />

          <Separator />
        </div>
      </div>
    )
  }

  private getDatesInitialValues = () => {
    const { condition } = this.props

    const statement = condition.statements[0]

    const object = statement && JSON.parse(statement.objectJSON)

    const initialValues = object && {
      from: object.from && new Date(object.from),
      to: object.to && new Date(object.to),
    }

    return initialValues
  }

  private getPageContextFromScope(scope: ConfigurationScope): PageContext {
    const { pageContext } = this.props

    if (['sitewide', 'template'].includes(scope)) {
      return { id: '*', type: '*' }
    }

    return pageContext
  }

  private handleDateChange = (dates: Typings.DateRange) => {
    const object =
      dates.from || dates.to
        ? {
            ...(dates.from && dates.to
              ? dates
              : { date: dates.from || dates.to }),
          }
        : null

    const verb = object
      ? (dates.from && dates.to && 'between') || (dates.from && 'from') || 'to'
      : null

    const statements =
      object && verb
        ? formatStatements([
            {
              error: null,
              object,
              subject: 'date',
              verb,
            },
          ])
        : []

    this.props.onConditionChange({
      statements,
    })
  }

  private handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { condition, onConditionChange } = this.props

    const newPageContext = this.getPageContextFromScope(
      event.target.value as ConfigurationScope
    )

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
