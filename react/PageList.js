import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import PagesQuery from './queries/Pages.graphql'

import {Link} from 'render'
import Button from '@vtex/styleguide/lib/Button'

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
        <h2>My Pages</h2>
          {loading && 'loading'}
          {
            !loading && !children
            ? <table className="collapse">
                <tbody>
                  <tr className="striped--near-white ">
                    <th className="pv2 ph3 tl f6 fw6 ttu">
                      Name
                    </th>
                    <th className="tl f6 ttu fw6 pv2 ph3">
                      Path
                    </th>
                  </tr>
                {
                  pages.map(page =>
                    <tr className="striped--near-white" key={page.name}>
                      <td className="pv2 ph3" >
                        {page.name}
                      </td>
                      <td className="pv2 ph3">
                        <Link to={`pages/page${page.path}`} className="rebel-pink no-underline underline-hover">
                          {page.path}
                        </Link>
                      </td>
                    </tr>
                  )
                }
                </tbody>
              </table>
            : null
          }
          <div className="pv4 pl50">
            <Link to='pages/new'>
              <Button>New page</Button>
            </Link>
          </div>
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
