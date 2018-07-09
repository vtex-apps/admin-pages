import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import PageEditor from './components/PageEditor'
import PageQuery from './queries/Page.graphql'

// eslint-disable-next-line
class PageDetail extends Component {
  public static propTypes = {
    data: PropTypes.object,
    params: PropTypes.object,
  }

  public static contextTypes = {
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  public componentDidMount() {
    this.toggleLoading()
  }

  public componentDidUpdate() {
    this.toggleLoading()
  }

  public toggleLoading = () => {
    this.props.data && this.props.data.loading ? this.context.startLoading() : this.context.stopLoading()
  }

  public render() {
    const { data: { loading, page: pageData } = {}, params: { name } } = this.props

    if (loading) {
      return (
        <span>Loading...</span>
      )
    }

    const pagesJSON = pageData && pageData.pagesJSON
    const extensionsJSON = pageData && pageData.extensionsJSON
    const pages = name !== 'new' && pagesJSON && JSON.parse(pagesJSON)
    const extensions = name !== 'new' && extensionsJSON && JSON.parse(extensionsJSON)
    const page = pages && pages[name]
    const component = extensions[name] && extensions[name].component

    const form = (
      <PageEditor
        declarer={page.declarer}
        name={name}
        path={page.path}
        component={component}
      />
    )

    return (
      <div className="ph5 mw7 mr-auto ml-auto pt6">
        <h1>{page ? 'Page detail' : 'Create new page'}</h1>
        {form}
      </div>
    )
  }
}

export default graphql(PageQuery, {
  options: (props) => ({
    variables: {
      page: props.params.name,
      locale: global.__RUNTIME__.culture.locale,
    },
  }),
  skip: (props) => props.params.name === 'new',
})(PageDetail)
