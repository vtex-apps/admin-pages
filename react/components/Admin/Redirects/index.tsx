import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import PageRedirects from '../../../queries/PageRedirects.graphql'
import RemovePageRedirect from '../../../queries/RemovePageRedirect.graphql'

import RedirectModal from './RedirectModal'
import RedirectsList from './RedirectsList'

interface Props {
  pageRedirectsQuery: {
    loading: boolean
    pageRedirects: Redirect[]
  }
  removePageRedirect: (options: object) => void
}

interface State {
  isModalOpen: boolean
  selectedRedirect: Redirect
}

class Redirects extends Component<Props, State> {
  public static contextTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      isModalOpen: false,
      selectedRedirect: {
        active: false,
        endDate: '',
        fromUrl: '',
        toUrl: '',
      },
    }
  }

  public componentDidMount() {
    this.handleLoading()
  }

  public componentDidUpdate() {
    this.handleLoading()
  }

  public render() {
    const {
      pageRedirectsQuery: { loading, pageRedirects = [] },
    } = this.props

    return (
      <Fragment>
        <RedirectModal
          isModalOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
          onInputChange={this.handleInputChange}
          redirectInfo={this.state.selectedRedirect}
        />
        {loading ? (
          <span>Loading...</span>
        ) : (
          <RedirectsList
            onCreate={this.handleRedirectCreation}
            onDelete={this.handleRedirectDeletion}
            onSelect={this.handleRedirectSelection}
            redirects={pageRedirects}
          />
        )}
      </Fragment>
    )
  }

  private handleInputChange = (inputData: any) => {
    this.setState({
      selectedRedirect: {
        ...this.state.selectedRedirect,
        ...inputData,
      },
    })
  }

  private handleLoading = () => {
    if (this.props.pageRedirectsQuery.loading) {
      this.context.startLoading()
    } else {
      this.context.stopLoading()
    }
  }

  private handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  private handleRedirectCreation = () => {
    this.setState({
      isModalOpen: true,
    })
  }

  private handleRedirectDeletion = async (event: Event) => {
    event.stopPropagation()

    const { removePageRedirect } = this.props

    try {
      const data = await removePageRedirect({
        variables: {
          id: 'redirect-config-id',
        },
      })

      console.log('OK!', data)
    } catch (err) {
      alert('Error removing page redirect configuration.')
      console.log(err)
    }
  }

  private handleRedirectSelection = (event: { rowData: Redirect }) => {
    this.setState({
      isModalOpen: true,
      selectedRedirect: event.rowData,
    })
  }
}

export default compose(
  graphql(PageRedirects, {
    name: 'pageRedirectsQuery',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  graphql(RemovePageRedirect, {
    name: 'removePageRedirect',
    options: { fetchPolicy: 'cache-and-network' },
  }),
)(Redirects)
