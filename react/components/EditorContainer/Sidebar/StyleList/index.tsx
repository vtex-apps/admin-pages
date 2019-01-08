import { filter } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql, withApollo, WithApolloClient } from 'react-apollo'
import { Alert, Button, Input, Spinner } from 'vtex.styleguide'

import CreateStyle from '../../../../queries/CreateStyle.graphql'
import ListStyles from '../../../../queries/ListStyles.graphql'
import SaveSelectedStyle from '../../../../queries/SaveSelectedStyle.graphql'

import Modal from '../../../../components/Modal'
import List from './List'

interface ListStylesQuery {
  listStyles: Style[]
  loading: boolean
  refetch: (variables?: object) => void
}

interface CustomProps {
  iframeWindow: Window
  stylesQueryInfo: ListStylesQuery
}

type Props = WithApolloClient<CustomProps>

interface ModalInfo {
  alertMessage: string
  isOpen: boolean
  newStyleName: string
  showAlert: boolean
}

interface State {
  modal: ModalInfo
}

class StyleList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      modal: {
        alertMessage: '',
        isOpen: false,
        newStyleName: '',
        showAlert: false,
      }
    }
  }

  public render() {
    const { stylesQueryInfo: { listStyles, loading } } = this.props
    const { modal: { alertMessage, isOpen, showAlert } } = this.state

    return loading ? (
      <div className="pt7 flex justify-around">
        <Spinner />
      </div>
    ) : (
      <div>
        <div>
          <List
            onChange={ this.onChange }
            styles={ listStyles }
          />
        </div>
        <div className="flex justify-around">
          <Modal
            isActionLoading={ false }
            isOpen={ isOpen }
            onClickAction={ this.createStyle }
            onClickCancel={ this.toggleModal }
            onClose={ this.toggleModal }
            textButtonAction="Create New Style"
            textButtonCancel="Cancel"
          >
            <div className="pb5">New Style</div>
            <div
              className="b--muted-4 bw1 bt pv5"
              style={{ maxWidth: '100vh', width: '35rem' }}
            >
              <Input
                placeholder="Type a name to your style"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                onChange={ this.onModalChange }
              />
            </div>
            {
              showAlert
              ? <Alert type="error">
                  { alertMessage }
                </Alert>
              : null
            }
          </Modal>
          <Button
            onClick={ this.toggleModal }
            variation="tertiary"
            size="regular"
          >
            New Style
          </Button>
        </div>
      </div>
    )
  }

  private createStyle = async () => {
    const { client, stylesQueryInfo: { refetch } } = this.props
    const { modal, modal: { newStyleName } } = this.state

    try {
      await client.mutate<{ createStyle: StyleBasic }>({
        mutation: CreateStyle,
        variables: {
          name: newStyleName,
        },
      })
      refetch()
      this.setState({
        modal: {
          ...modal,
          isOpen: false,
        }
      })
    } catch (err) {
      this.setState({
        modal: {
          ...modal,
          alertMessage: err.graphQLErrors[0].message,
          showAlert: true,
        }
      })
    }
  }

  private onChange = async (style: Style) => {
    const { client, iframeWindow, stylesQueryInfo: { refetch } } = this.props

    const styleLinkElement = iframeWindow && iframeWindow.document && iframeWindow.document.getElementById('style_link')
    if (styleLinkElement) {
      styleLinkElement.setAttribute('href', style.path)
    }

    try {
      await client.mutate<{ saveSelectedStyle: StyleBasic }>({
        mutation: SaveSelectedStyle,
        variables: {
          app: style.app,
          name: style.name,
        },
      })
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  private onModalChange = (event: Event) => {
    const { modal } = this.state
    if (event.target instanceof HTMLInputElement) {
      this.setState({
        modal: {
          ...modal,
          newStyleName: event.target.value,
        }
      })
    }
  }

  private toggleModal = async () => {
    const { modal } = this.state

    this.setState({
      modal: {
        ...modal,
        isOpen: !modal.isOpen,
      }
    })
  }
}

export default compose(
  graphql(ListStyles, { name: 'stylesQueryInfo' }),
  withApollo,
)(StyleList)
