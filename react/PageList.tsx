import PropTypes from 'prop-types'
import { filter, flatten, sort } from 'ramda'
import React, { Component } from 'react'
import { compose, DataProps, graphql } from 'react-apollo'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import PageForm from './components/PageForm'
import AvailableConditions from './queries/AvailableConditions.graphql'
import AvailableTemplates from './queries/AvailableTemplates.graphql'
import Routes from './queries/Routes.graphql'

import './editbar.global.css'

interface PageData {
  routes: Route[]
}

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
    this.props.templates.loading || this.props.routes.loading
      ? this.context.startLoading()
      : this.context.stopLoading()
  }

  public renderPageListEntry = (route: Route) =>
    route.pages.map((page: Page, index: number) => (
      <tr className="striped--near-white" key={`${route.id}-${index}`}>
        <td className="pv4 ph3 w-10">{route.id}</td>
        <td className="pv4 ph3 w-20" style={{ wordBreak: 'break-word' }}>
          {route.path}
        </td>
        <td className="pv4 ph3 w-10">{page.name}</td>
        <td
          className={`pv4 ph3 w-10 ${
            page.conditions.length === 0 ? 'gray' : ''
          }`}
        >
          {page.conditions.length > 0 ? `${page.conditions.length}` : '(none)'}
        </td>
        <td className="pa4 w-10 v-align-center">
          <div className="flex justify-between">
            <Link to={`/admin/cms/pages/page/${page.configurationId}`}>
              <Button variation="primary" size="small">
                <div className="flex">Settings</div>
              </Button>
            </Link>
          </div>
        </td>
      </tr>
    ))

  public renderPageList(routes: Route[]) {
    return (
      <div>
        <div className="flex justify-end items-center mb4">
          <div>
            <Link page="admin/cms/page-detail" params={{ pageId: 'new' }}>
              <Button size="small" variation="primary">
                New page
              </Button>
            </Link>
          </div>
        </div>
        <table className="collapse w-100">
          <tbody>
            <tr className="striped--near-white pv4">
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">Route ID</th>
              <th className="tl f6 ttu fw6 w-20 ph3 pv6">Path Template</th>
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">Name</th>
              <th className="tl f6 ttu fw6 w-10 ph3 pv6">Conditions</th>
              <th className="tl f6 ttu fw6 w-10 pv6" />
            </tr>
            {flatten(routes.map(this.renderPageListEntry))}
          </tbody>
        </table>
      </div>
    )
  }

  public renderPageDetail(
    configurationId: string,
    routes: Route[],
    templates: Template[],
    availableConditions: string[],
  ) {
    return (
      <PageForm
        routes={routes}
        templates={templates}
        configurationId={configurationId === 'new' ? null : configurationId}
        availableConditions={availableConditions}
      />
    )
  }

  public render() {
    const {
      conditions: { loading: loadingAvailableConditions },
      params: { pageId: configurationId },
      routes: { loading: loadingRoutes, routes = [] },
      templates: {
        loading: loadingTemplates,
        availableTemplates: templates = [],
      },
    } = this.props

    const availableConditions =
      this.props.conditions &&
      this.props.conditions.availableConditions &&
      this.props.conditions.availableConditions.map(
        condition => condition.conditionId,
      )

    const isStore = (route: Route) => route.id.startsWith('store')

    const storeRoutes = filter(isStore, routes)
    const sortedRoutes = sort<Route>((a: Route, b: Route) => {
      return a.id.localeCompare(b.id)
    }, storeRoutes)

    const isViewingPage = !!configurationId
    const pageDetail =
      isViewingPage &&
      this.renderPageDetail(
        configurationId,
        routes,
        templates,
        availableConditions,
      )

    const pageList = !isViewingPage && this.renderPageList(sortedRoutes)

    const spinner = (loadingAvailableConditions ||
      loadingTemplates ||
      loadingRoutes) && <span>Loading...</span>

    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        {spinner || pageDetail || pageList}
      </div>
    )
  }
}

export default compose(
  graphql(AvailableConditions, {
    name: 'conditions',
  }),
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
  }),
)(PageList)
