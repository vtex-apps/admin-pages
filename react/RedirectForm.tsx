import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import {
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'
import { Binding, Tenant } from 'vtex.tenant-graphql'
import queryString from 'query-string'

import {
  BASE_URL,
  NEW_REDIRECT_ID,
  WRAPPER_PATH,
} from './components/admin/redirects/consts'
import Form from './components/admin/redirects/Form'
import Operations from './components/admin/redirects/Form/Operations'
import { RedirectQuery } from './components/admin/redirects/Form/typings'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import Redirect from './queries/Redirect.graphql'
import TenantInfoQuery from './queries/TenantInfo.graphql'
import { getStoreBindings } from './utils/bindings'

interface CustomProps {
  params: {
    path: string
  }
}

type Props = WithApolloClient<
  CustomProps &
    RenderContextProps &
    ComponentWithIntlProps &
    TargetPathContextProps
>

interface State {
  formData?: Redirect
  isLoading: boolean
  storeBindings: Binding[] | null
}

class RedirectForm extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    const defaultFormData = {
      endDate: null,
      from: '',
      to: '',
      type: 'PERMANENT' as RedirectTypes,
      binding: '',
    }

    const isNew = props.params.path === NEW_REDIRECT_ID

    this.state = {
      formData: isNew ? defaultFormData : undefined,
      isLoading: isNew ? false : true,
      storeBindings: null,
    }
  }

  public async componentDidMount() {
    const {
      client,
      params,
      runtime: { navigate, history },
      setTargetPath,
    } = this.props
    const { formData } = this.state

    setTargetPath(WRAPPER_PATH)
    // Get tenant info
    const { data } = await client.query<{ tenantInfo: Tenant }, {}>({
      query: TenantInfoQuery,
    })
    const tenantInfo = data?.tenantInfo
    if (!tenantInfo) {
      throw Error()
    }
    const storeBindings = getStoreBindings(tenantInfo)
    this.setState({
      storeBindings,
    })

    if (!formData) {
      try {
        const rawQuerystring = history?.location?.search ?? ''
        const querystring = queryString.parse(rawQuerystring)
        const { binding, ...rest } = querystring
        const restQuerystring = queryString.stringify(rest)
        const response = await client.query<RedirectQuery>({
          query: Redirect,
          variables: {
            path: `/${params.path}${
              restQuerystring ? '?' + restQuerystring : ''
            }`,
            binding: binding,
          },
        })

        const redirectInfo = response.data.redirect.get
        if (redirectInfo) {
          this.setState({
            formData: redirectInfo,
            isLoading: false,
          })
        } else {
          console.warn('Invalid path. Navigating to redirect list...')

          navigate({ to: BASE_URL })
        }
      } catch (err) {
        console.error(err)

        navigate({ to: BASE_URL })
      }
    } else {
      if (!formData.binding) {
        formData.binding = storeBindings[0].id
        this.setState({
          formData,
        })
      }
    }
  }

  public render() {
    const { intl, params } = this.props
    const { formData, isLoading, storeBindings } = this.state

    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage({
              id:
                params.path === NEW_REDIRECT_ID
                  ? 'admin/pages.admin.redirects.form.title.new'
                  : 'admin/pages.admin.redirects.form.title.info',
            })}
          </title>
        </Helmet>
        <Operations>
          {({ deleteRedirect, saveRedirect }) =>
            isLoading ? (
              <Loader />
            ) : (
              <ToastConsumer>
                {({ showToast }) => (
                  <Box>
                    <Form
                      initialData={formData as Redirect}
                      onDelete={deleteRedirect}
                      onSave={saveRedirect}
                      showToast={showToast}
                      storeBindings={storeBindings}
                    />
                  </Box>
                )}
              </ToastConsumer>
            )
          }
        </Operations>
      </>
    )
  }
}

export default injectIntl(
  withApollo(withRuntimeContext(withTargetPath(RedirectForm)))
)
