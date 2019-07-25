import { pathOr } from 'ramda'
import * as React from 'react'
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo'

import { parseStoreAppId } from '../utils'

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import ContentIOMessageQuery from '../../../../queries/ContentIOMessage.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import RouteQuery from '../../../../queries/Route.graphql'
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

import Loader from '../../../Loader'

interface TemplateVariables {
  interfaceId: string
}

export interface OperationsResults {
  deleteRoute: MutationFn<any, DeleteRouteVariables>
  saveRoute: MutationFn<any, SaveRouteVariables>
  saveContent: MutationFn<any, any>
  templatesResults: QueryResult<any, TemplateVariables>
}

export interface ContentContextProps {
  route: any
  blockId: string
  interfaceId: string
  content: {
    id: string
    text: string
  }
  deleteRoute: MutationFn<any, DeleteRouteVariables>
  saveRoute: MutationFn<any, SaveRouteVariables>
  saveContent: MutationFn<any, any>
}

function withContentContext(WrappedComponent: React.ComponentType) {
  return (props: any) => {
    const routeId = decodeURIComponent(props.params.id)
    const storeAppId = parseStoreAppId(props.store)
    const interfaceId = `${storeAppId}:store.content`

    return (
      <Query<any, any>
        query={RouteQuery}
        variables={{ domain: 'store', routeId }}
      >
        {({ data: dataRoute, loading: loadingRoute }) => {
          if (loadingRoute) {
            return <Loader />
          }

          return (
            <Query<any, TemplateVariables>
              query={AvailableTemplates}
              variables={{ interfaceId }}
            >
              {({ data: dataTemplates, loading: loadingTemplates }) => {
                if (loadingTemplates) {
                  return <Loader />
                }

                const blockId = dataTemplates!.availableTemplates.filter(
                  (template: Template) => template.id !== interfaceId
                )[0].id

                return (
                  <ListContentQuery
                    variables={{
                      blockId,
                      pageContext: {
                        id: '*',
                        type: '*',
                      },
                      template: blockId,
                      treePath: `${routeId}/flex-layout.row#content-body/rich-text`,
                    }}
                  >
                    {({ data: dataContent, loading: loadingContent }) => {
                      if (loadingContent) {
                        return <Loader />
                      }

                      const contentJSON: string | null = pathOr(
                        null,
                        [
                          'listContentWithSchema',
                          'content',
                          '0',
                          'contentJSON',
                        ],
                        dataContent!
                      )
                      const contentText: string = contentJSON
                        ? JSON.parse(contentJSON).text
                        : ''
                      const contentId: string | null = pathOr(
                        '',
                        ['listContentWithSchema', 'content', '0', 'contentId'],
                        dataContent!
                      )

                      return (
                        <Query
                          query={ContentIOMessageQuery}
                          variables={{
                            args: {
                              messages: [{ id: contentText || '' }],
                              provider: contentId,
                              to: props.runtime.culture.locale,
                            },
                          }}
                        >
                          {({
                            data: dataMessage,
                            loading: loadingMessage,
                          }: QueryResult<any, any>) => {
                            if (loadingMessage) {
                              return <Loader />
                            }

                            const content = {
                              id: contentId,
                              text: dataMessage.translate[0] || contentText,
                            }

                            return (
                              <Mutation<
                                DeleteMutationResult['data'],
                                DeleteRouteVariables
                              >
                                mutation={DeleteRoute}
                                update={updateStoreAfterDelete}
                              >
                                {deleteRoute => (
                                  <Mutation<
                                    SaveMutationResult['data'],
                                    SaveRouteVariables
                                  >
                                    mutation={SaveRoute}
                                    update={updateStoreAfterSave}
                                  >
                                    {saveRoute => (
                                      <SaveContentMutation>
                                        {saveContent => (
                                          <WrappedComponent
                                            {...props}
                                            route={(dataRoute || {}).route}
                                            saveRoute={saveRoute}
                                            deleteRoute={deleteRoute}
                                            saveContent={saveContent}
                                            content={content}
                                            blockId={blockId}
                                            interfaceId={interfaceId}
                                          />
                                        )}
                                      </SaveContentMutation>
                                    )}
                                  </Mutation>
                                )}
                              </Mutation>
                            )
                          }}
                        </Query>
                      )
                    }}
                  </ListContentQuery>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}

export default withContentContext
