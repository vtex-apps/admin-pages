import React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'

import { SaveRouteVariables } from './typings'
import { updateStoreAfterDelete, updateStoreAfterSave } from './utils'

interface TemplateVariables {
  interfaceId: string
}

interface Props {
  interfaceId: string
  children: (mutations: OperationsObj) => React.ReactNode
}

interface OperationsObj {
  deleteRoute: MutationFn
  saveRoute: MutationFn<any, SaveRouteVariables>
  templatesResults: QueryResult<any, TemplateVariables>
}

const Operations = ({interfaceId, children}: Props) => (
  <Query<Template[], TemplateVariables>
    query={AvailableTemplates}
    variables={{ interfaceId }}
  >
    {templatesResults => (
      <Mutation mutation={DeleteRoute} update={updateStoreAfterDelete}>
        {deleteRoute => (
          <Mutation<any, SaveRouteVariables> mutation={SaveRoute} update={updateStoreAfterSave}>
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
