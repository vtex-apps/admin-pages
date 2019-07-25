import React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import { parseStoreAppId } from '../utils'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import SaveContentMutation from '../../../EditorContainer/mutations/SaveContent'
import ListContentQuery from '../../../EditorContainer/queries/ListContent'

import {
  DeleteMutationResult,
  DeleteRouteVariables,
  SaveMutationResult,
  SaveRouteVariables,
} from '../../pages/Form/typings'
import {
  updateStoreAfterDelete,
  updateStoreAfterSave,
} from '../../pages/Form/utils'

import {
  AvailableApp,
  InstalledApp,
} from '../../../EditorContainer/StoreEditor/Store/StoreForm/components/withStoreSettings'

interface Props {
  children: (mutations: any) => React.ReactNode
  routeId?: string
  store: AvailableApp & InstalledApp & { settings: string }
}

interface TemplateVariables {
  interfaceId: string
}

export interface OperationsResults {
  deleteRoute: MutationFn<any, DeleteRouteVariables>
  saveRoute: MutationFn<any, SaveRouteVariables>
  saveContent: MutationFn<any, any>
  templatesResults: QueryResult<any, TemplateVariables>
}

const Operations = ({ children, routeId, store }: Props) => {
  const storeAppId = parseStoreAppId(store)
  return (
    <Query<Template[], TemplateVariables>
      query={AvailableTemplates}
      variables={{ interfaceId: `${storeAppId}:store.content` }}
    >
      {templates => (
        <Mutation<DeleteMutationResult['data'], DeleteRouteVariables>
          mutation={DeleteRoute}
          update={updateStoreAfterDelete}
        >
          {deleteRoute => (
            <Mutation<SaveMutationResult['data'], SaveRouteVariables>
              mutation={SaveRoute}
              update={updateStoreAfterSave}
            >
              {saveRoute => (
                <ListContentQuery
                  variables={{
                    blockId: '',
                    pageContext: {
                      id: '*',
                      type: '*',
                    },
                    template: `${storeAppId}:store.content`,
                    treePath: `${routeId}/flex-layout.row#content-body/rich-text`,
                  }}
                >
                  {content => (
                    <SaveContentMutation>
                      {saveContent =>
                        children({
                          content,
                          deleteRoute,
                          saveContent,
                          saveRoute,
                          templates,
                        })
                      }
                    </SaveContentMutation>
                  )}
                </ListContentQuery>
              )}
            </Mutation>
          )}
        </Mutation>
      )}
    </Query>
  )
}
export default Operations
