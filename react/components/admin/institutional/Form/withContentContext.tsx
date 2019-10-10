import { pathOr } from 'ramda'
import * as React from 'react'
import { Mutation, MutationFunction, Query, QueryResult } from 'react-apollo'

import Loader from './Loader'
import UnallowedWarning from './UnallowedWarning'

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

import AvailableTemplates from '../../../../queries/AvailableTemplates.graphql'
import ContentIOMessageQuery from '../../../../queries/ContentIOMessage.graphql'
import DeleteRoute from '../../../../queries/DeleteRoute.graphql'
import RouteQuery from '../../../../queries/Route.graphql'
import SaveRoute from '../../../../queries/SaveRoute.graphql'
import SaveContentMutation from '../../../EditorContainer/mutations/SaveContent'
import ListContentQuery from '../../../EditorContainer/queries/ListContent'

interface TemplateData {
  availableTemplates: {
    id: string
  }[]
}

interface TemplateVariables {
  interfaceId: string
}

interface RouteData {
  route: Route
}

interface RouteVariables {
  domain: string
  routeId: string
}

interface MessagesData {
  translate: string[]
}

interface MessagesVariables {
  args: {
    from?: string
    messages: {
      provider: string
      messages: {
        id: string
        content?: string
        description?: string
        behavior?: 'USER_ONLY' | 'USER_AND_APP' | 'FULL'
      }[]
    }[]
    to: string
  }
}

export interface OperationsResults {
  deleteRoute: MutationFunction<unknown, DeleteRouteVariables>
  saveRoute: MutationFunction<unknown, SaveRouteVariables>
  saveContent: MutationFunction<unknown, unknown>
  templatesResults: QueryResult<unknown, TemplateVariables>
}

export interface ContentContextProps {
  route: Route
  blockId: string
  interfaceId: string
  content: {
    id: string
    text: string
  }
  deleteRoute: MutationFunction<unknown, DeleteRouteVariables>
  saveRoute: MutationFunction<unknown, SaveRouteVariables>
  saveContent: MutationFunction<unknown, unknown>
}

interface Params {
  culture: {
    locale: string
  }
  routeId: string
  storeAppId: string
}

function withContentContext<T>(
  WrappedComponent: React.ComponentType<T>,
  getParams: (props: T) => Params
) {
  const ComponentWithContent = (props: T) => {
    const { storeAppId, routeId, culture } = getParams(props)
    const interfaceId = `${storeAppId}:store.content`

    return (
      <Query<RouteData, RouteVariables>
        query={RouteQuery}
        variables={{ domain: 'store', routeId }}
      >
        {({ data: dataRoute, loading: loadingRoute }) => {
          if (loadingRoute) {
            return <Loader />
          }

          return (
            <Query<TemplateData, TemplateVariables>
              query={AvailableTemplates}
              variables={{ interfaceId }}
            >
              {({ data: dataTemplates, loading: loadingTemplates }) => {
                if (loadingTemplates) {
                  return <Loader />
                }

                const eligibleTemplates =
                  dataTemplates &&
                  dataTemplates.availableTemplates.filter(
                    (template: Template) => template.id !== interfaceId
                  )

                if (!eligibleTemplates || !eligibleTemplates.length) {
                  return <UnallowedWarning />
                }

                const blockId = eligibleTemplates[0].id

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
                        dataContent || {}
                      )
                      const contentText: string = contentJSON
                        ? JSON.parse(contentJSON).text
                        : ''
                      const contentId: string = pathOr(
                        '',
                        ['listContentWithSchema', 'content', '0', 'contentId'],
                        dataContent || {}
                      )

                      return (
                        <Query<MessagesData, MessagesVariables>
                          query={ContentIOMessageQuery}
                          variables={{
                            args: {
                              from: 'en-DV',
                              messages: [
                                {
                                  provider: contentId,
                                  messages: [{ id: contentText || '' }],
                                },
                              ],
                              to: culture.locale,
                            },
                          }}
                        >
                          {({ data: dataMessage, loading: loadingMessage }) => {
                            if (loadingMessage) {
                              return <Loader />
                            }

                            const content = {
                              id: contentId,
                              text: pathOr(
                                contentText,
                                ['newTranslate', 0],
                                dataMessage || {}
                              ),
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
                                            route={dataRoute && dataRoute.route}
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

  return ComponentWithContent
}

export default withContentContext
