import React from 'react'
import { Query, QueryResult } from 'react-apollo'

import AvailableConditions from '../../../../queries/AvailableConditions.graphql'
import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'

interface Props {
  children: (queryResults: QueryResultsObj) => React.ReactNode
}

interface TemplateVariables {
  renderMajor: number
  routeId: string | null
}

interface QueryResultsObj {
  conditionsResults: QueryResult
  templatesResults: QueryResult<any, TemplateVariables>
}

const Queries = (props: Props) => (
  <Query
    query={AvailableTemplates}
    variables={{
      renderMajor: 7,
      routeId: null,
    } as TemplateVariables}
  >
    {templatesResults => (
      <Query
        query={AvailableConditions}
      >
        {conditionsResults =>
          props.children({
            conditionsResults,
            templatesResults,
          })
        }
      </Query>
    )}
  </Query>
)

export default Queries
