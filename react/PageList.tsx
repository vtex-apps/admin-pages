import PropTypes from 'prop-types'
import { filter, flatten, init, last, sort } from 'ramda'
import React, { Component } from 'react'
import { compose, DataProps, graphql } from 'react-apollo'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import PageEditor from './components/PageEditor'
import ShareIcon from './images/ShareIcon'
import AvailableTemplates from './queries/AvailableTemplates.graphql'
import Routes from './queries/Routes.graphql'

interface PageData {
  routes: Route[]
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
    this.toggleLoading()
  }

  public componentDidUpdate() {
    this.toggleLoading()
  }

  public toggleLoading = () => {
    this.props.templates.loading || this.props.routes.loading ? this.context.startLoading() : this.context.stopLoading()
  }

  public renderPageListEntry = (route: Route) => route.pages.map((page: Page) => (
    <tr className="striped--near-white" key={route.id}>
      <td className="pv4 ph3 w-10">{route.id}</td>
      <td className="pv4 ph3 w-20" style={{'wordBreak': 'break-word'}}>{route.path}</td>
      <td className="pv4 ph3 w-10" >
        Default
      </td>
      <td className="pv4 ph3 w-10 gray">(none)</td>
      <td className="pa4 w-10 v-align-center">
        <div className="flex justify-between">
          <Link to={`/admin/pages/page/${route.id}/${page.name}`}>
            <Button variation="primary" size="small">
              <div className="flex">Settings</div>
            </Button>
          </Link>
          <a href={route.path} target="_blank">
            <Button variation="secondary" size="small">
              <div className="flex"><ShareIcon /> <span className="pl4">View</span></div>
            </Button>
          </a>
        </div>
      </td>
    </tr>
  ))

  public renderPageList(routes: Route[]) {
    return (
      <div>
        <div className="flex justify-between items-center mb4">
          <h1>Pages</h1>
          <div>
            <Link page="admin/pages-detail" params={{pageId: 'new'}}>
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
              flatten(routes.map(this.renderPageListEntry))
            }
          </tbody>
        </table>
      </div>
    )
  }

  public renderPageDetail(routeId: string, name: string, routes: Route[], templates: Template[]) {
    return (
      <PageEditor
        routes={routes}
        templates={templates}
        routeId={name === 'new' ? null : routeId}
        name={name === 'new' ? null : name}
      />
    )
  }

  public render() {
    const {
      templates: { loading: loadingTemplates, availableTemplates: templates = [] },
      routes: { loading: loadingRoutes, routes = [] },
      params: { pageId },
    } = this.props

    const segments: string[] = pageId && pageId.split('/')
    const routeId = pageId && init(segments).join('/')
    const name = pageId && last(segments)

    console.log('render', routeId, name, routes, templates)

    const isStore = (route: Route) => route.id.startsWith('store')

    const storeRoutes = filter(isStore, routes)

    const sortedRoutes = sort<Route>((a: Route, b: Route) => {
      return a.id.localeCompare(b.id)
    }, storeRoutes)

    const isViewingPage = !!pageId

    const pageDetail = isViewingPage && this.renderPageDetail(routeId, name!, routes, templates)

    const pageList = !isViewingPage && this.renderPageList(sortedRoutes)

    const spinner = (loadingTemplates || loadingRoutes) && <span>Loading...</span>

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        {spinner || pageDetail || pageList}
      </div>
    )
  }
}

export default compose(
  graphql(AvailableTemplates, {
    name: 'templates',
    options: () => ({
      variables: {
        renderMajor: 7,
        routeId: null,
      },
    }),
  }),
  graphql(Routes, {
    name: 'routes',
  })
)(PageList)
