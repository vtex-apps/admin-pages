import PropTypes from 'prop-types'
import { filter, sort } from 'ramda'
import React, { Component } from 'react'
import { DataProps, graphql } from 'react-apollo'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import ShareIcon from './images/ShareIcon'
import Pages from './queries/Pages.graphql'

interface PageData {
  pages: Page[]
}

// eslint-disable-next-line
class PageList extends Component<DataProps<PageData>> {
  public static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  public static contextTypes = {
    prefetchPage: PropTypes.func,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  public componentDidMount() {
    this.context.prefetchPage('admin/pages/detail')
    this.toggleLoading()
  }

  public componentDidUpdate() {
    this.toggleLoading()
  }

  public toggleLoading = () => {
    this.props.data.loading ? this.context.startLoading() : this.context.stopLoading()
  }

  public renderPageListEntry = (page: Page) => (
    <tr className="striped--near-white" key={page.name}>
      <td className="pv4 ph3 w-10">{page.name}</td>
      <td className="pv4 ph3 w-20" style={{'wordBreak': 'break-word'}}>{page.path}</td>
      <td className="pv4 ph3 w-10" >
        Default
      </td>
      <td className="pv4 ph3 w-10 gray">(none)</td>
      <td className="pa4 w-10 v-align-center">
        <div className="flex justify-between">
          <Link to={`/admin/pages/page/${page.name}`}>
            <Button variation="primary" size="small">
              <div className="flex">Settings</div>
            </Button>
          </Link>
          <a href={page.path} target="_blank">
            <Button variation="secondary" size="small">
              <div className="flex"><ShareIcon /> <span className="pl4">View</span></div>
            </Button>
          </a>
        </div>
      </td>
    </tr>
  )

  public render() {
    const { data: { loading, pages = [] }, children } = this.props

    const isStore = (page: Page) => page.name.startsWith('store')

    const storePages = filter(isStore, pages)
    const sortedPages = sort<Page>((a: Page, b: Page) => {
      return a.name.localeCompare(b.name)
    }, storePages)

    const pageList = (
      <div>
        <div className="flex justify-between items-center mb4">
          <h1>Pages</h1>
          <div>
            <Link to="pages/page/new">
              <Button size="small" variation="primary">New page</Button>
            </Link>
          </div>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white pv4">
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">
                Route ID
              </th>
              <th className="tl f6 ttu fw6 w-20 ph3 pv6">
                Path Template
              </th>
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">
                Name
              </th>
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">
                Conditions
              </th>
              <th className="tl f6 ttu fw6 w-10 pv6">
              </th>
            </tr>
            {
              sortedPages.map(this.renderPageListEntry)
            }
          </tbody>
        </table>
      </div>
    )

    const spinner = loading && <span>Loading...</span>

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        {spinner || children || pageList}
      </div>
    )
  }
}

export default graphql(Pages)(PageList)
