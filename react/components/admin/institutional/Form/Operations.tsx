import React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'

import SaveContentMutation from '../../../EditorContainer/mutations/SaveContent'


import {
  DeleteRouteVariables,
  SaveRouteVariables,
} from '../../pages/Form/typings'

import { updateStoreAfterDelete, updateStoreAfterSave } from '../../pages/Form/utils'

interface TemplateVariables {
  interfaceId: string
}

interface Props {
  children: (mutations: any) => React.ReactNode
}

export interface OperationsResults {
  deletePage: MutationFn<any, DeleteRouteVariables>
  savePage: MutationFn<any, SaveRouteVariables>
}

// TODO: add save SEO mutation
// TODO: add save content mutation

const Operations = ({ children }: Props) => (
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
          <SaveContentMutation>
            {(saveContent: any) => 
              children({
                deletePage,
                saveContent,
                savePage,
              })
            }
          </SaveContentMutation>
        }
      </Mutation>
    )}
  </Mutation>
)

export default Operations
