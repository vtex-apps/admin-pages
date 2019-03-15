import React, { Component, Fragment } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'
import { ToastConsumer } from 'vtex.styleguide'

import AdminWrapper from './components/admin/AdminWrapper'
import {
  BASE_URL,
  NEW_REDIRECT_ID,
  WRAPPER_PATH,
} from './components/admin/redirects/consts'
import Form from './components/admin/redirects/Form'
import Operations from './components/admin/redirects/Form/Operations'
import { RedirectQuery } from './components/admin/redirects/Form/typings'
import Loader from './components/Loader'
import Redirect from './queries/Redirect.graphql'

interface CustomProps {
  params: { id: string }
}

type Props = WithApolloClient<
  CustomProps & RenderContextProps & ReactIntl.InjectedIntlProps
>

interface State {
  formData?: Redirect
  isLoading: boolean
}

class RedirectForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const defaultFormData = {
      cacheId: '',
      disabled: false,
      endDate: '',
      from: '',
      id: NEW_REDIRECT_ID,
      to: '',
      type: 'permanent' as RedirectTypes,
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
    } = this.props
    const { formData } = this.state

    if (!formData) {
      try {
        const response = await client.query<RedirectQuery>({
          query: Redirect,
          variables: {
            id: params.id,
          },
        })

        const redirectInfo = response.data.redirect

        if (redirectInfo) {
          this.setState({
            formData: redirectInfo,
            isLoading: false,
          })
        } else {
          console.log('Invalid ID. Navigating to redirect list...')

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
      <Fragment>
        <Helmet>
          <title>
            {intl.formatMessage({
              id:
                params.id === NEW_REDIRECT_ID
                  ? 'pages.admin.redirects.form.title.new'
                  : 'pages.admin.redirects.form.title.info',
            })}
          </title>
        </Helmet>
        <AdminWrapper targetPath={WRAPPER_PATH}>
          <Operations>
            {({ deleteRedirect, saveRedirect }) =>
              isLoading ? (
                <Loader />
              ) : (
                <ToastConsumer>
                  {({ showToast }) => (
                    <Form
                      initialData={formData as Redirect}
                      onDelete={deleteRedirect}
                      onSave={saveRedirect}
                      showToast={showToast}
                    />
                  )}
                </ToastConsumer>
              )
            }
          </Operations>
        </AdminWrapper>
      </Fragment>
    )
  }
}

export default compose(
  injectIntl,
  withApollo,
  withRuntimeContext
)(RedirectForm)
