import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import AvailableConditions from '../../../../queries/AvailableConditions.graphql'
import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'

import { updateStoreAfterDelete, updateStoreAfterSave } from './utils'

import { Query, QueryResult } from 'react-apollo'

interface TemplateVariables {
  renderMajor: number
  routeId: string | null
}

interface Props {
  children: (mutations: OperationsObj) => React.ReactNode
}

interface OperationsObj {
  deleteRoute: MutationFn
  saveRoute: MutationFn
  conditionsResults: QueryResult
  templatesResults: QueryResult<any, TemplateVariables>
}

const Operations = (props: Props) => (
  <Query
    query={AvailableTemplates}
    variables={{ renderMajor: 7, routeId: null } as TemplateVariables}
  >
    {templatesResults => (
      <Query query={AvailableConditions}>
        {conditionsResults => (
          <Mutation mutation={DeleteRoute} update={updateStoreAfterDelete}>
            {deleteRoute => (
              <Mutation mutation={SaveRoute} update={updateStoreAfterSave}>
                {saveRoute =>
                  props.children({
                    conditionsResults,
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
    )}
  </Query>
)

export default Operations
