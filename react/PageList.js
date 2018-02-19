import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql} from 'react-apollo'
import PagesQuery from './queries/Pages.graphql'

import {Link} from 'render'
import Button from '@vtex/styleguide/lib/Button'
import shareIcon from './images/share-26.svg'

// eslint-disable-next-line
class PageList extends Component {
  static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  render() {
    const {data: {loading, pages}, children} = this.props

    const pageList = !children && (
      <div className="ph5 mw7 mr-auto ml-auto mv6">
        <div className="flex justify-between items-center mb4">
          <h1>My Pages</h1>
          <div>
            <Link to="pages/page/new">
              <Button primary>New page</Button>
            </Link>
          </div>
        </div>
          {loading && 'loading'}
          {
            !loading && !children
            ? <table className="collapse w-100">
              <tbody>
                <tr className="striped--near-white">
                  <th className="pv4 ph4 tl f6 fw6 ttu">
                    Name
                  </th>
                  <th className="tl f6 ttu fw6 pv2 ph3">
                    Path
                  </th>
                  <th className="tl f6 ttu fw6 pv2 ph3">
                  </th>
                </tr>
                {
                  pages.map(page => (
                    <tr className="striped--near-white" key={page.name}>
                      <td className="pv5 ph4" >
                        <Link to={`/admin/pages/page/${page.name}`} className="rebel-pink no-underline underline-hover">
                          {page.name}
                        </Link>
                      </td>
                      <td className="pv2 ph3">
                        {page.path}
                      </td>
                      <td><a href={page.path} className="rebel-pink no-underline underline-hover ph4"><div><img src={shareIcon} /></div></a></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            : null
          }
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
