import React, { Component, Fragment } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { Helmet, withRuntimeContext } from 'render'

import { BASE_URL, NEW_REDIRECT_ID } from './components/admin/redirects/consts'
import Form from './components/admin/redirects/Form'
import Operations from './components/admin/redirects/Form/Operations'
import { RedirectQuery } from './components/admin/redirects/Form/typings'
import Styles from './components/admin/Styles'
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
              id: params.id === NEW_REDIRECT_ID
                ? 'pages.admin.redirects.form.title.new'
                : 'pages.admin.redirects.form.title.info',
            })}
          </title>
        </Helmet>
        <Styles>
          <Operations>
            {({ deleteRedirect, saveRedirect }) =>
              isLoading ? (
                <Loader />
              ) : (
                <Form
                  initialData={formData}
                  onDelete={deleteRedirect}
                  onSave={saveRedirect}
                />
              )
            }
          </Operations>
        </Styles>
      </Fragment>
    )
  }
}

export default compose(
  injectIntl,
  withApollo,
  withRuntimeContext,
)(RedirectForm)
