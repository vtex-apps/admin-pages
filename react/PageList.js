import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
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

  static contextTypes = {
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  componentDidMount() {
    this.toggleLoading()
  }

  componentDidUpdate() {
    this.toggleLoading()
  }

  toggleLoading = () => {
    this.props.data.loading ? this.context.startLoading() : this.context.stopLoading()
  }

  renderPageListEntry = page => (
    <tr className="striped--near-white" key={page.name}>
      <td className="pv5 w-20 pl4" >
        <Link to={`/admin/pages/page/${page.name}`} className="rebel-pink no-underline underline-hover">
          {page.path}
        </Link>
      </td>
      {page.declarer
        ? (
          <td className="pv2 w-30">
            {page.declarer}
          </td>
        )
        : <td className="pv2 w-10"></td>
      }
      <td><a href={page.path} className="rebel-pink no-underline underline-hover tr"><div className="mr4"><ShareIcon /></div></a></td>
    </tr>
  )

  render() {
    const { data: { loading, pages }, children } = this.props

    const customPages = pages && pages.filter(({ declarer }) => !declarer)
    const appsPages = pages && pages.filter((page) => {
      return !!page.declarer && page.name.startsWith('store')
    })

    const customPageList = pages && (
      <div>
        <div className="flex justify-between items-center mb4">
          <h1>My Routes</h1>
          <div>
            <Link to="pages/page/new">
              <Button size="small" variation="primary">New page</Button>
            </Link>
          </div>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white">
              <th className="tl f6 ttu fw6 w-40">
                Path Template
              </th>
              <th className="tl f6 ttu fw6 w-30">
                Context Provider
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

    const appsPageList = pages && (
      <div>
        <div className="flex justify-between items-center mb4 pt7">
          <h3>Routes declared by installed apps</h3>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white">
              <th className="tl f6 ttu fw6 pv2 w-40">
                Path Template
              </th>
              <th className="tl f6 ttu fw6 pv2 w-30">
                Context Provider
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

    const list = (
      <Fragment>
        {customPageList}
        {appsPageList}
      </Fragment>
    )

    const spinner = loading && <span>Loading...</span>

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        {spinner || children || list}
      </div>
    )
  }
}

export default graphql(PagesQuery)(PageList)
