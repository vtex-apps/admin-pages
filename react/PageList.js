import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import PagesQuery from './queries/Pages.graphql'

// eslint-disable-next-line
class PageList extends Component {
  static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  render() {
    const {data: {loading, pages}, children} = this.props

    const pageList = !children && (
      <div>
        <h3>My Pages</h3>
        {loading && 'loading'}
        {!loading && !children && JSON.stringify(pages)}
      </div>
    )

    return (
      <div>
        {pageList}
        {children}
      </div>
    )
  }
}

export default graphql(PagesQuery)(PageList)
