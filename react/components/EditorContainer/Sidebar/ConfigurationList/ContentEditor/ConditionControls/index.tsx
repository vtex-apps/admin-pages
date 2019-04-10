import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { formatStatements } from '../../../../../../utils/conditions'

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
}

class ConditionControls extends Component<Props> {
  public render() {
    const { condition, isSitewide, pageContext } = this.props

    const scope = isSitewide
      ? 'sitewide'
      : condition.pageContext.id === '*'
      ? 'template'
      : 'entity'

    return (
      <Fragment>
        <FormattedMessage id="pages.editor.components.condition.title">
          {message => (
            <div className="mv5 pt5 ph5 bt bw1 b--light-silver flex items-center f4">
              {message}
            </div>
          )}
        </FormattedMessage>

        <div className="mv7 ph5">
          <ScopeSelector
            isSitewide={isSitewide}
            onChange={this.handleScopeChange}
            pageContext={pageContext}
            scope={scope}
          />

          <Separator />

          <Scheduler
            initialValues={this.getDatesInitialValues()}
            updateCondition={this.handleDateChange}
          />
        </div>
      </Fragment>
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
