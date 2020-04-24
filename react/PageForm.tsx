import { equals } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'

import { RouteFormData } from 'pages'

import {
  NEW_ROUTE_ID,
  ROUTES_LIST,
  WRAPPER_PATH,
} from './components/admin/pages/consts'
import Form from './components/admin/pages/Form'
import Operations from './components/admin/pages/Form/Operations'
import Title from './components/admin/pages/Form/Title'
import { formatToFormData } from './components/admin/pages/Form/utils'
import { getRouteTitle } from './components/admin/pages/utils'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
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
    blockId: '',
    context: null,
    declarer: null,
    domain: 'store',
    interfaceId: 'vtex.store@2.x:store.custom',
    metaTagDescription: '',
    metaTagKeywords: [],
    pages: [],
    path: '',
    routeId: '',
    title: '',
    uuid: undefined,
    dataSource: 'vtex.rewriter'
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
    const { client, setTargetPath } = this.props
    const { formData } = this.state

    setTargetPath(WRAPPER_PATH)

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
    const { formData, isLoading } = this.state

    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <Operations interfaceId={formData.interfaceId}>
            {({ deleteRoute, saveRoute, templatesResults }) => {
              const templates = templatesResults.data.availableTemplates || []
              const loading = templatesResults.loading
              return loading ? (
                <Loader />
              ) : (
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
                        isCustomPage={formData.interfaceId.includes(
                          'store.custom'
                        )}
                        onDelete={deleteRoute}
                        onExit={this.exit}
                        onSave={saveRoute}
                        templates={templates}
                        showToast={showToast}
                        hideToast={hideToast}
                      />
                    )}
                  </ToastConsumer>
                </Box>
              )
            }}
          </Operations>
        )}
      </>
    )
  }

  private exit = () => {
    this.props.runtime.navigate({ page: ROUTES_LIST, params: {} })
  }
}

export default withApollo(withRuntimeContext(withTargetPath(PageForm)))
