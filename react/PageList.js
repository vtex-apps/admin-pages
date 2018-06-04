import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import ShareIcon from './images/ShareIcon'
import PagesQuery from './queries/Pages.graphql'

// eslint-disable-next-line
class PageList extends Component {
  static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  renderPageListEntry = page => (
    <tr className="striped--near-white" key={page.name}>
      <td className="pv5 w-20 pl4" >
        <Link to={`/admin/pages/page/${page.name}`} className="rebel-pink no-underline underline-hover">
          {page.name}
        </Link>
      </td>
      <td className="pv2 w-40">
        {page.path}
      </td>
      {page.declarer
        ? (
          <td className="pv2 w-30">
            {page.declarer}
          </td>
        )
        : <td className="pv2 w-10">
          </td>
      }
      <td><a href={page.path} className="rebel-pink no-underline underline-hover tr"><div className="mr4"><ShareIcon /></div></a></td>
    </tr>
  )

  render() {
    const {data: {loading, pages}, children} = this.props

    if (children) {
      return (
        <div className="mw8 mr-auto ml-auto mv6">
          {children}
        </div>
      )
    }

    if (loading) {
      return (
        <div className="mw8 mr-auto ml-auto mv6">
          <span>Loading...</span>
        </div>
      )
    }

    const customPages = pages && pages.filter(({declarer}) => !declarer)
    const appsPages = pages && pages.filter(({declarer}) => !!declarer)

    const customPageList = (
      <div>
        <div className="flex justify-between items-center mb4">
          <h1>My Pages</h1>
          <div>
            <Link to="pages/page/new">
              <Button size="small" variation="primary">New page</Button>
            </Link>
          </div>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white">
              <th className="pv4 w-20 tl f6 fw6 ttu pl4">
                Name
              </th>
              <th className="tl f6 ttu fw6 w-40">
                Path
              </th>
              <th className="tl f6 ttu fw6 w-30">
              </th>
              <th className="tl f6 ttu fw6 w-10">
              </th>
            </tr>
            {
              customPages.map(this.renderPageListEntry)
            }
          </tbody>
        </table>
      </div>
    )

    const appsPageList = (
      <div>
        <div className="flex justify-between items-center mb4 pt7">
          <h3>Pages declared by installed apps</h3>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white">
              <th className="pv4 w-20 tl f6 fw6 ttu pl4">
                Name
              </th>
              <th className="tl f6 ttu fw6 pv2 w-40">
                Path
              </th>
              <th className="tl f6 ttu fw6 pv2 w-30">
                App
              </th>
              <th className="tl f6 ttu fw6 pv2 w-10">
              </th>
            </tr>
            {
              appsPages.map(this.renderPageListEntry)
            }
          </tbody>
        </table>
      </div>
    )

    return (
      <div className="mw8 mr-auto ml-auto mv6">
        {customPageList}
        {appsPageList}
      </div>
    )
  }
}

export default graphql(PagesQuery)(PageList)
