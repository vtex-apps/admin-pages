import React, { Component } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'render'
import { Box } from 'vtex.styleguide'

import { LIST_PATHNAME, NEW_ROUTE_ID } from './components/admin/Pages/consts'
import Form from './components/admin/Pages/Form'
import Operations from './components/admin/Pages/Form/Operations'
import Title from './components/admin/Pages/Form/Title'
import {
  getRouteTitle,
  isNewRoute,
  isStoreRoute,
} from './components/admin/Pages/utils'
import Styles from './components/admin/Styles'
import Loader from './components/Loader'
import RouteQuery from './queries/Route.graphql'

interface CustomProps {
  params: {
    id: string
  }
  runtime: RenderContext
}

type Props = WithApolloClient<CustomProps & RenderContextProps>

interface State {
  formData?: Route
  isLoading: boolean
}

class PageForm extends Component<Props, State> {
  private isNew: boolean

  constructor(props: Props) {
    super(props)

    const routeId = props.params.id

    if (!isStoreRoute(routeId) && !isNewRoute(routeId)) {
      this.exit()
    }

    const defaultFormData = {
      context: '',
      declarer: '',
      id: NEW_ROUTE_ID,
      login: false,
      pages: [],
      path: '',
      template: '',
      title: '',
    }

    this.isNew = isNewRoute(routeId)

    this.state = {
      formData: this.isNew ? defaultFormData : undefined,
      isLoading: !this.isNew,
    }
  }

  public async componentDidMount() {
    const { client, params } = this.props
    const { formData } = this.state

    if (!formData) {
      try {
        const {
          data: { route },
        } = await client.query<{ route: Route }>({
          query: RouteQuery,
          variables: {
            id: params.id,
          },
        })

        if (route) {
          const routeWithPagesUniqueId = {
            ...route,
            pages: (route.pages|| []).map((page, uniqueId) => ({
              ...page,
              uniqueId: page.configurationId || uniqueId
            }))
          }
          this.setState({
            formData: routeWithPagesUniqueId,
            isLoading: false,
          })
        } else {
          this.exit()
        }
      } catch (err) {
        this.exit()
      }
    }
  }

  public render() {
    const { formData, isLoading } = this.state

    return (
      <Styles>
        <Operations>
          {({
            conditionsResults,
            deleteRoute,
            saveRoute,
            templatesResults,
          }) => {
            const templates = templatesResults.data.availableTemplates || []
            const conditions = conditionsResults.data.availableConditions || []
            const loading =
              isLoading || templatesResults.loading || conditionsResults.loading
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
                <Form
                  initialData={formData}
                  onDelete={deleteRoute}
                  onExit={this.exit}
                  onSave={saveRoute}
                  templates={templates}
                  conditions={conditions}
                />
              </Box>
            )
          }}
        </Operations>
      </Styles>
    )
  }

  private exit = () => {
    this.props.runtime.navigate({ page: LIST_PATHNAME, params: {} })
  }
}

export default compose(
  withApollo,
  withRuntimeContext,
)(PageForm)
