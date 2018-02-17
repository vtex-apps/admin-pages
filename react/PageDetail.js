import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import PageQuery from './queries/Pages.graphql'

// eslint-disable-next-line
class PageDetail extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  render() {
    const {data: {loading, page}} = this.props
    return (
      <div>
        <h3>My Pages</h3>
        {loading && 'loading'}
        {!loading && JSON.stringify(page)}
      </div>
    )
  }
}

export default graphql(PageQuery, {
  options: {
    variables: (props) => ({
      page: props.params.name,
      locale: global.__RUNTIME__.culture.locale,
    }),
  },
})(PageDetail)
