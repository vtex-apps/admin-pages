import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'

import PageQuery from './queries/Page.graphql'
import PageEditor from './components/PageEditor'

// eslint-disable-next-line
class PageDetail extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  render() {
    const {data: {loading, page} = {}} = this.props

    const form = <PageEditor page={page} />
    return (
      <div>
        <h3>{page ? 'Page Detail' : 'Create Page'}</h3>
        {loading && 'loading'}
        {!loading && form}
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
