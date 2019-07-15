import { pathOr } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'

import { RouteFormData } from 'pages'

import Form from './components/admin/institutional/Form'
import Operations from './components/admin/institutional/Form/Operations'
import { parseStoreAppId } from './components/admin/institutional/utils'

import { INSTITUTIONAL_ROUTES_LIST, NEW_ROUTE_ID } from './components/admin/pages/consts'
import Title from './components/admin/pages/Form/Title'
import { formatToFormData } from './components/admin/pages/Form/utils'
import { getRouteTitle } from './components/admin/pages/utils'
import { TargetPathContextProps, withTargetPath } from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import { TargetPathRenderProps } from './PagesAdminWrapper'
import RouteQuery from './queries/Route.graphql'

import withStoreSettings, { FormProps } from './components/EditorContainer/StoreEditor/Store/StoreForm/components/withStoreSettings'

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
  TargetPathContextProps &
  FormProps
>

interface State {
  formData: RouteFormData
  isLoading: boolean
  routeId: string
}

class PageForm extends Component<Props, State> {
  private isNew: boolean

  constructor(props: Props) {
    super(props)

    const routeId = decodeURIComponent(props.params.id)

    this.isNew = routeId === NEW_ROUTE_ID
    this.state = {
      formData: this.defaultFormData(),
      isLoading: !this.isNew,
      routeId,
    }
  }

  public async componentDidMount() {
    const { client } = this.props

    if (!this.isNew) {
      try {
        const { data: { route } } = await client.query<{ route: Route }>({
          fetchPolicy: 'no-cache', // TODO: add updater to mutation
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
    const { store, runtime } = this.props
    const { formData, isLoading, routeId } = this.state

    if (isLoading) {
      return <Loader />
    }

    return (
      <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
        <div className="center mw8 mv8">
          <Operations routeId={routeId} store={store}>
            {({ deleteRoute, saveRoute, saveContent, content }) => {
              if (content.loading) {
                return <Loader />
              }

              const contentJSON: string | null = pathOr(null, ['data', 'listContentWithSchema', 'content', '0', 'contentJSON'], content)
              const contentId: string | null = pathOr('', ['data', 'listContentWithSchema', 'content', '0', 'contentId'], content)

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
                        store={store}
                        initialData={formData}
                        initialContent={{
                          id: contentId!,
                          text: contentJSON ? JSON.parse(contentJSON).text : '',
                        }}
                        culture={runtime.culture}
                        onDelete={deleteRoute}
                        onExit={this.exit}
                        onSave={saveRoute}
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

  private defaultFormData = (): RouteFormData => {
    const storeAppId = parseStoreAppId(this.props.store)
    return {
      auth: false,
      blockId: `${storeAppId}:store.institutional`,
      context: `${storeAppId}/InstitutionalContext`,
      declarer: null,
      domain: 'store',
      interfaceId: `${storeAppId}:store.institutional`,
      metaTagDescription: '',
      metaTagKeywords: [],
      pages: [],
      path: '',
      routeId: '',
      title: '',
      uuid: undefined,  
    }    
  }
}

export default withApollo(
  withRuntimeContext(
    withTargetPath(
      withStoreSettings(PageForm)
    )
  )
)
