import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import { parseStoreAppId } from '../utils'

import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import SaveContentMutation from '../../../EditorContainer/mutations/SaveContent'
import ListContentQuery from '../../../EditorContainer/queries/ListContent'

import {
  DeleteRouteVariables,
  SaveRouteVariables,
} from '../../pages/Form/typings'

import { updateStoreAfterDelete, updateStoreAfterSave } from '../../pages/Form/utils'

import { AvailableApp, InstalledApp } from '../../../EditorContainer/StoreEditor/Store/StoreForm/components/withStoreSettings'

interface Props {
  children: (mutations: any) => React.ReactNode
  routeId?: string
  store: AvailableApp & InstalledApp & { settings: string }
}

export interface OperationsResults {
  deletePage: MutationFn<any, DeleteRouteVariables>
  savePage: MutationFn<any, SaveRouteVariables>
  saveContent: MutationFn<any, any>
}

const Operations = ({ children, routeId, store }: Props) => {
  const storeAppId = parseStoreAppId(store)
  return (
    <Mutation
      mutation={DeleteRoute}
      update={updateStoreAfterDelete}
    >
      {(deletePage: any) => (
        <Mutation
          mutation={SaveRoute}
          update={updateStoreAfterSave}
        >
          {(savePage: any) =>
            <ListContentQuery
              variables={{
                blockId: `${storeAppId}:store.institutional`,
                pageContext: {
                  id: '*',
                  type: '*',
                },
                template: `${storeAppId}:store.institutional`,
                treePath: `${routeId}/flex-layout.row#institutional-body/rich-text`,
              }}
            >
              {(content: any) => (
                <SaveContentMutation>
                  {(saveContent: any) => 
                    children({
                      content,
                      deletePage,
                      saveContent,
                      savePage,
                    })
                  }
                </SaveContentMutation>
              )}
            </ListContentQuery>
          }
        </Mutation>
      )}
    </Mutation>
  )
}
export default Operations
