import React from 'react'
import { Mutation, MutationFunction, Query, QueryResult } from 'react-apollo'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import {
  DeleteMutationResult,
  DeleteRouteVariables,
  SaveMutationResult,
  SaveRouteVariables,
  TemplateMutationResult,
} from './typings'
import { updateStoreAfterDelete, updateStoreAfterSave } from './utils'

interface TemplateVariables {
  interfaceId: string
}

interface Props {
  interfaceId: string
  children: (mutations: OperationsResults) => JSX.Element | null
}

export interface OperationsResults {
  deleteRoute: MutationFunction<
    DeleteMutationResult['data'],
    DeleteRouteVariables
  >
  saveRoute: MutationFunction<SaveMutationResult['data'], SaveRouteVariables>
  templatesResults: QueryResult<
    TemplateMutationResult['data'],
    TemplateVariables
  >
}

const Operations = ({ interfaceId, children }: Props) => (
  <Query<TemplateMutationResult['data'], TemplateVariables>
    query={AvailableTemplates}
    variables={{ interfaceId }}
  >
    {templatesResults => (
      <Mutation<DeleteMutationResult['data'], DeleteRouteVariables>
        mutation={DeleteRoute}
        update={updateStoreAfterDelete}
      >
        {deleteRoute => (
          <Mutation<SaveMutationResult['data'], SaveRouteVariables>
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
