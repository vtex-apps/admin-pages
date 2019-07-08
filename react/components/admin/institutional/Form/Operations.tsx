import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'

import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import SaveContentMutation from '../../../EditorContainer/mutations/SaveContent'
import ListContentQuery from '../../../EditorContainer/queries/ListContent'

import {
  DeleteRouteVariables,
  SaveRouteVariables,
} from '../../pages/Form/typings'

import { updateStoreAfterDelete, updateStoreAfterSave } from '../../pages/Form/utils'

interface Props {
  children: (mutations: any) => React.ReactNode
  routeId?: string 
}

export interface OperationsResults {
  deletePage: MutationFn<any, DeleteRouteVariables>
  savePage: MutationFn<any, SaveRouteVariables>
  saveContent: MutationFn<any, any>
}

const Operations = ({ children, routeId }: Props) => (
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
              blockId: 'vtex.store@2.x:store.institutional',
              pageContext: {
                id: '*',
                type: '*',
              },
              template: 'vtex.store@2.x:store.institutional',
              treePath: `${routeId}/rich-text`,
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

export default Operations
