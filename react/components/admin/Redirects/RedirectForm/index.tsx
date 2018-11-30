import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { withRuntimeContext } from 'render'

import Redirect from '../../../../queries/Redirect.graphql'
import Loader from '../../../Loader'
import Styles from '../../Styles'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'

import Form from './Form'
import Operations from './Operations'
import { RedirectQuery } from './typings'

interface CustomProps {
  params: { id: string }
}

type Props = WithApolloClient<CustomProps & RenderContextProps>

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
    const { formData, isLoading } = this.state

    return (
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
    )
  }
}

export default withApollo(withRuntimeContext(RedirectForm))
