import React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import { DeleteRouteVariables, SaveRouteVariables } from './typings'
import { updateStoreAfterDelete, updateStoreAfterSave } from './utils'

interface TemplateVariables {
  interfaceId: string
}

interface Props {
  interfaceId: string
  children: (mutations: OperationsResults) => React.ReactNode
}

export interface OperationsResults {
  deleteRoute: MutationFn<any, DeleteRouteVariables>
  saveRoute: MutationFn<any, SaveRouteVariables>
  templatesResults: QueryResult<any, TemplateVariables>
}

const Operations = ({ interfaceId, children }: Props) => (
  <Query<Template[], TemplateVariables>
    query={AvailableTemplates}
    variables={{ interfaceId }}
  >
    {templatesResults => (
      <Mutation<any, DeleteRouteVariables>
        mutation={DeleteRoute}
        update={updateStoreAfterDelete}
      >
        {deleteRoute => (
          <Mutation<any, SaveRouteVariables>
            mutation={SaveRoute}
            update={updateStoreAfterSave}
          >
            {saveRoute =>
              children({
                deleteRoute,
                saveRoute,
                templatesResults,
              })
            }
          </Mutation>
        )}
      </Mutation>
    )}
  </Query>
)

export default Operations
