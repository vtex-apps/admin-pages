import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import PageRedirects from '../../../queries/PageRedirects.graphql'
import RemovePageRedirect from '../../../queries/RemovePageRedirect.graphql'

import RedirectForm from './RedirectForm'
import RedirectsList from './RedirectsList'

interface Props {
  pageRedirectsQuery: {
    loading: boolean
    pageRedirects: Redirect[]
  }
  removePageRedirect: (options: object) => void
}

interface State {
  selectedRedirect: Redirect | null
}

class Redirects extends Component<Props, State> {
  public static contextTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      selectedRedirect: null,
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

    const { selectedRedirect } = this.state

    if (loading) {
      return <span>Loading...</span>
    }

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        {selectedRedirect ? (
          <RedirectForm
            closeForm={this.handleFormClose}
            onInputChange={this.handleInputChange}
            redirectInfo={this.state.selectedRedirect}
          />
        ) : (
          <RedirectsList
            onCreate={this.handleRedirectCreation}
            onDelete={this.handleRedirectDeletion}
            onSelect={this.handleRedirectSelection}
            redirects={pageRedirects}
          />
        )}
      </div>
    )
  }

  private getDefaultRedirectInfo() {
    return {
      active: false,
      endDate: '',
      fromUrl: '',
      toUrl: '',
    }
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

  private handleFormClose = () => {
    this.setState({ selectedRedirect: null })
  }

  private handleRedirectCreation = () => {
    this.setState({
      selectedRedirect: this.getDefaultRedirectInfo(),
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
