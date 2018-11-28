import React, { Component } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'render'
import { Box, Spinner } from 'vtex.styleguide'

import { LIST_PATHNAME, NEW_ROUTE_ID } from './components/admin/Pages/consts'
import Form from './components/admin/Pages/Form'
import Operations from './components/admin/Pages/Form/Operations'
import Queries from './components/admin/Pages/Form/Queries'
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
      templateId: '',
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
          this.setState({
            formData: route,
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
          {({ deleteRoute, saveRoute }) =>
            isLoading ? (
              <Loader />
            ) : (
              <Queries>
                {({templatesResults, conditionsResults}) => {
                  const templates = templatesResults.data.availableTemplates || []
                  const conditions = conditionsResults.data.availableConditions || []
                  const loading = templatesResults.loading || conditionsResults.loading
                  return loading ? <Spinner /> : (
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
              </Queries>
            )
          }
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
