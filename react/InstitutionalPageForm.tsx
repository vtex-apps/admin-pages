import { equals, pathOr } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'

import { RouteFormData } from 'pages'

import Form from './components/admin/institutional/Form'
import Operations from './components/admin/institutional/Form/Operations'

import { INSTITUTIONAL_ROUTES_LIST, NEW_ROUTE_ID } from './components/admin/pages/consts'
import Title from './components/admin/pages/Form/Title'
import { formatToFormData } from './components/admin/pages/Form/utils'
import { getRouteTitle } from './components/admin/pages/utils'
import { TargetPathContextProps, withTargetPath } from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import { TargetPathRenderProps } from './PagesAdminWrapper'
import RouteQuery from './queries/Route.graphql'
import RoutesQuery from './queries/Routes.graphql'

interface CustomProps {
  params: {
    id: string
  }
  runtime: RenderContext
}

type Props = WithApolloClient<
  CustomProps &
    RenderContextProps &
    TargetPathRenderProps &
    TargetPathContextProps
>

interface State {
  formData: RouteFormData
  isLoading: boolean
  routeId: string
}

class PageForm extends Component<Props, State> {
  private isNew: boolean
  private defaultFormData: RouteFormData = {
    auth: false,
    blockId: 'vtex.store@2.x:store.institutional',
    context: null,
    declarer: null,
    domain: 'store',
    interfaceId: 'vtex.store@2.x:store.institutional',
    metaTagDescription: '',
    metaTagKeywords: [],
    pages: [],
    path: '',
    routeId: '',
    title: '',
    uuid: undefined,
  }

  constructor(props: Props) {
    super(props)

    const routeId = decodeURIComponent(props.params.id)

    const { client } = props
    let currentRoute = null

    // Find route from cache
    try {
      const { routes } = client.readQuery<{ routes: Route[] }>({
        query: RoutesQuery,
        variables: { domain: 'store' },
      }) || { routes: [] }
      currentRoute = routes.find(
        ({ routeId: routeIdFromRoute }) => routeIdFromRoute === routeId
      )
    } catch (e) {
      // console.error(e)
    }

    this.isNew = routeId === NEW_ROUTE_ID

    this.state = {
      formData: currentRoute
        ? formatToFormData(currentRoute)
        : this.defaultFormData,
      isLoading: !this.isNew,
      routeId,
    }
  }

  public async componentDidMount() {
    const { client } = this.props
    const { formData } = this.state

    if (equals(formData, this.defaultFormData) && !this.isNew) {
      // didnt find in cache
      try {
        const {
          data: { route },
        } = await client.query<{ route: Route }>({
          query: RouteQuery,
          variables: {
            domain: 'store',
            routeId: this.state.routeId,
          },
        })

        if (route) {
          this.setState({
            formData: formatToFormData(route),
            isLoading: false,
          })
        } else {
          this.exit()
        }
      } catch (err) {
        console.error(err)
        this.exit()
      }
    } else {
      this.setState({ isLoading: false })
    }
  }

  public render() {
    const { formData, isLoading, routeId } = this.state

    if (isLoading) {
      return <Loader />
    }

    return (
      <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
        <div className="center mw8 mv8">
          <Operations routeId={routeId}>
            {({ deletePage, savePage, saveContent, content }) => {
              const contentJSON: string | null = pathOr(null, ['data', 'listContentWithSchema', 'content', '0', 'contentJSON'], content)
              
              if (content.loading) {
                return <Loader />
              }

              return (
                <Box>
                  {this.isNew ? (
                    <FormattedMessage id="admin/pages.admin.pages.form.title.new">
                      {text => <Title>{text}</Title>}
                    </FormattedMessage>
                  ) : (
                    formData && <Title>{getRouteTitle(formData)}</Title>
                  )}
                  <ToastConsumer>
                    {({ showToast, hideToast }) => (
                      <Form
                        initialData={formData}
                        initialContent={contentJSON ? JSON.parse(contentJSON).text : ''}
                        onDelete={deletePage}
                        onExit={this.exit}
                        onSave={savePage}
                        onSaveContent={saveContent}
                        showToast={showToast}
                        hideToast={hideToast}
                      />
                    )}
                  </ToastConsumer>
                </Box>
              )
            }}
          </Operations>
        </div>
      </div>
    )
  }

  private exit = () => {
    this.props.runtime.navigate({ page: INSTITUTIONAL_ROUTES_LIST, params: {} })
  }
}

export default withApollo(withRuntimeContext(withTargetPath(PageForm)))
