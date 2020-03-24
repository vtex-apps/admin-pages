import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { injectIntl, IntlShape } from 'react-intl'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'

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

interface CustomProps {
  params: {
    id: string
  }
  intl: IntlShape
}

type Props = WithApolloClient<
  CustomProps & RenderContextProps & TargetPathContextProps
>

interface State {
  formData?: Redirect
  isLoading: boolean
}

class RedirectForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const defaultFormData = {
      endDate: null,
      from: '',
      to: '',
      type: 'PERMANENT' as RedirectTypes,
    }

    const isNew = props.params.id === NEW_REDIRECT_ID

    this.state = {
      formData: isNew ? defaultFormData : undefined,
      isLoading: isNew ? false : true,
    }
  }

  public async componentDidMount() {
    const {
      client,
      params,
      runtime: { navigate },
      setTargetPath,
    } = this.props
    const { formData } = this.state

    setTargetPath(WRAPPER_PATH)

    if (!formData) {
      try {
        const response = await client.query<RedirectQuery>({
          query: Redirect,
          variables: {
            path: '/' + params.id,
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
        console.log(err)

        navigate({ to: BASE_URL })
      }
    }
  }

  public render() {
    const { intl, params } = this.props
    const { formData, isLoading } = this.state

    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage({
              id:
                params.id === NEW_REDIRECT_ID
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
