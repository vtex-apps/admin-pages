import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import PageQuery from './queries/Page.graphql'

// eslint-disable-next-line
class PageDetail extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  render() {
    const {data: {loading, page}} = this.props
    return (
      <div>
        <h3>Page Detail</h3>
        {loading && 'loading'}
        {!loading && JSON.stringify(page)}
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
})(PageDetail)
