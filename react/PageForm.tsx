import { equals } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'
import { Binding, Tenant } from 'vtex.tenant-graphql'
import { RouteFormData } from 'pages'

import {
  NEW_ROUTE_ID,
  ROUTES_LIST,
  WRAPPER_PATH,
  DATA_SOURCE,
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
import TenantInfoQuery from './queries/TenantInfo.graphql'
import { getStoreBindings } from './utils/bindings'

interface CustomProps {
  params: {
    id: string
  }
  runtime: RenderContext
}

interface BindingProps {
  localStorageBinding?: Binding
  setLocalStorageBinding: (binding: Binding) => void
}

export type Props = BindingProps &
  WithApolloClient<
    CustomProps &
      RenderContextProps &
      TargetPathRenderProps &
      TargetPathContextProps
  >

interface State {
  formData: RouteFormData
  isLoading: boolean
  routeId: string
  storeBindings: Binding[] | null
}

class PageForm extends Component<Props, State> {
  private isNew: boolean
  private defaultFormData: RouteFormData = {
    auth: false,
    blockId: '',
    binding: undefined,
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
    dataSource: DATA_SOURCE,
  }

  public constructor(props: Props) {
    super(props)
    const { localStorageBinding } = props

    const routeId = decodeURIComponent(props.params.id)

    const { client } = props
    let currentRoute = null
    let tenantInfo = null
    let storeBindings = null

    // Find route from cache
    try {
      const { routes } = client.readQuery<{ routes: Route[] }>({
        query: RoutesQuery,
        variables: { domain: 'store', bindingId: localStorageBinding?.id },
      }) || { routes: [] }
      currentRoute = routes.find(
        ({ routeId: routeIdFromRoute }) => routeIdFromRoute === routeId
      )
    } catch (e) {
      // console.error(e)
    }

    // Get tenant data
    try {
      const data =
        client.readQuery<{ tenantInfo: Tenant }>({
          query: TenantInfoQuery,
        }) || null
      tenantInfo = data?.tenantInfo
    } catch (e) {
      // console.error(e)
    }
    if (tenantInfo) {
      storeBindings = getStoreBindings(tenantInfo)
      this.setState({
        storeBindings,
      })
      this.defaultFormData.binding =
        localStorageBinding?.id || storeBindings[0].id
    }

    this.isNew = routeId === NEW_ROUTE_ID

    this.state = {
      formData: currentRoute
        ? formatToFormData(currentRoute)
        : this.defaultFormData,
      isLoading: !this.isNew,
      routeId,
      storeBindings,
    }
  }

  public async componentDidMount() {
    const { client, setTargetPath } = this.props
    const { formData, storeBindings } = this.state

    setTargetPath(WRAPPER_PATH)

    // Get tenant info
    if (storeBindings === null) {
      try {
        const { data } = await client.query<{ tenantInfo: Tenant }, {}>({
          query: TenantInfoQuery,
        })
        const tenantInfo = data?.tenantInfo
        if (!tenantInfo) {
          throw Error()
        }
        const storeBindings = getStoreBindings(tenantInfo)
        formData.binding = storeBindings[0].id
        this.setState({
          formData,
          storeBindings,
        })
      } catch (e) {
        // console.error(e)
      }
    }

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
            bindingId: formData.binding,
          },
        })

        if (route) {
          this.setState({
            formData: formatToFormData(route),
            isLoading: false,
          })
        } else {
          this.handleExit()
        }
      } catch (err) {
        console.error(err)
        this.handleExit()
      }
    } else {
      this.setState({ isLoading: false })
    }
  }

  public render() {
    const { setLocalStorageBinding } = this.props
    const { formData, isLoading, storeBindings } = this.state

    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <Operations
            interfaceId={formData.interfaceId}
            binding={formData.binding}
          >
            {({ deleteRoute, saveRoute, templatesResults }) => {
              const templates =
                (templatesResults.data &&
                  templatesResults.data.availableTemplates) ||
                []
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
                        onExit={this.handleExit}
                        onSave={saveRoute}
                        templates={templates}
                        showToast={showToast}
                        hideToast={hideToast}
                        storeBindings={storeBindings}
                        setLocalStorageBinding={setLocalStorageBinding}
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

  private handleExit = () => {
    this.props.runtime.navigate({ page: ROUTES_LIST, params: {} })
  }
}

export default withApollo(withRuntimeContext(withTargetPath(PageForm)))
