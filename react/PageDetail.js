import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'

import PageQuery from './queries/Page.graphql'
import PageEditor from './components/PageEditor'

// eslint-disable-next-line
class PageDetail extends Component {
  static propTypes = {
    data: PropTypes.object,
    params: PropTypes.object,
  }

  render() {
    const {data: {loading, page: pageData} = {}, params: {name}} = this.props

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

    if (page) {
      page.name = name
      page.component = extensions[name].component
    }

    const form = <PageEditor page={page} />

    return (
      <div className="ph5 mw7 mr-auto ml-auto pt6">
        <h1>{page ? 'Page Detail' : 'Create Page'}</h1>
        {form}
      </div>
    )
  }
}

export default graphql(PageQuery, {
  skip: (props) => props.params.name === 'new',
  options: (props) => ({
    variables: {
      page: props.params.name,
      locale: global.__RUNTIME__.culture.locale,
    },
  }),
})(PageDetail)
