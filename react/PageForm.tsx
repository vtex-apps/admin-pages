import { equals } from 'ramda'
import React, { Component } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ConditionsOperator, ToastConsumer } from 'vtex.styleguide'

import { RouteFormData } from 'pages'

import AdminWrapper from './components/admin/AdminWrapper'
import { NEW_ROUTE_ID, ROUTES_LIST, WRAPPER_PATH } from './components/admin/pages/consts'
import Form from './components/admin/pages/Form'
import Operations from './components/admin/pages/Form/Operations'
import Title from './components/admin/pages/Form/Title'
import {
  getRouteTitle,
} from './components/admin/pages/utils'
import Loader from './components/Loader'
import RouteQuery from './queries/Route.graphql'
import RoutesQuery from './queries/Routes.graphql'

interface CustomProps {
  params: {
    id: string
  }
  runtime: RenderContext
}

type Props = WithApolloClient<CustomProps & RenderContextProps>

interface State {
  formData: RouteFormData
  isLoading: boolean
  routeId: string
}

type DateVerbOptions = 'between' | 'from' | 'is' | 'to'

interface DateInfoFormat {
  date: string
  to: string
  from: string
}
type DateStatementFormat = Record<keyof DateInfoFormat, Date>

const getConditionStatementObject = (objectJson: string, verb: DateVerbOptions): Partial<DateStatementFormat> => {
  const dateInfoStringValues: DateInfoFormat = JSON.parse(objectJson)

  return {
    between: {
      from: new Date(dateInfoStringValues.from),
      to: new Date(dateInfoStringValues.to),
    },
    from: {
      date: new Date(dateInfoStringValues.from)
    },
    is: {
      date: new Date(dateInfoStringValues.from),
    },
    to: {
      date: new Date(dateInfoStringValues.to)
    }
  }[verb]
}

const formatToFormData = (route: Route): RouteFormData => {
  return {
    ...route,
    pages: route.pages.map((page, index) => ({
      ...page,
      condition: {
        ...page.condition,
        statements: page.condition.statements.map(({verb, subject, objectJSON}) => ({
          error: '',
          object: getConditionStatementObject(objectJSON, verb as DateVerbOptions),
          subject,
          verb,
        })),
      },
      operator: page.condition.allMatches ? 'all' : 'any' as ConditionsOperator,
      uniqueId: index,
    })),
  }
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
      const { routes } = client.readQuery<{routes: Route[]}>({query: RoutesQuery, variables: {domain: 'store'}}) || { routes: [] }
      currentRoute = routes.find(({routeId: routeIdFromRoute}) => routeIdFromRoute === routeId)
    } catch (e) {
      // console.error(e)
    }

    this.isNew = routeId === NEW_ROUTE_ID

    this.state = {
      formData: currentRoute ? formatToFormData(currentRoute) : this.defaultFormData,
      isLoading: !this.isNew,
      routeId
    }
  }

  public async componentDidMount() {
    const { client } = this.props
    const { formData } = this.state

    if (equals(formData, this.defaultFormData) && !this.isNew) { // didnt find in cache
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
      this.setState({isLoading: false})
    }
  }

  public render() {
    const { formData, isLoading } = this.state

    return (
      <AdminWrapper path={WRAPPER_PATH}>
        { isLoading ? <Loader /> :
          <Operations interfaceId={formData.interfaceId}>
            {({
              deleteRoute,
              saveRoute,
              templatesResults,
            }) => {
              const templates = templatesResults.data.availableTemplates || []
              const loading = templatesResults.loading
              return loading ? (
                <Loader />
              ) : (
                <Box>
                  {this.isNew ? (
                    <FormattedMessage id="pages.admin.pages.form.title.new">
                      {text => <Title>{text}</Title>}
                    </FormattedMessage>
                  ) : (
                    formData && <Title>{getRouteTitle(formData)}</Title>
                  )}
                  <ToastConsumer>
                    {({showToast, hideToast}) => (
                      <Form
                        initialData={formData}
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

        }
      </AdminWrapper>
    )
  }

  private exit = () => {
    this.props.runtime.navigate({ page: ROUTES_LIST, params: {} })
  }
}

export default compose(
  withApollo,
  withRuntimeContext,
)(PageForm)
