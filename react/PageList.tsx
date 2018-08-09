import PropTypes from 'prop-types'
import { filter, flatten, slice, sort } from 'ramda'
import React, { Component } from 'react'
import { compose, DataProps, graphql } from 'react-apollo'
import { Link } from 'render'
import { FormattedMessage } from 'react-intl'

import { Button, Delete, Pagination, Tab, Table, Tabs } from 'vtex.styleguide'

import PageForm from './components/PageForm'
import AvailableConditions from './queries/AvailableConditions.graphql'
import AvailableTemplates from './queries/AvailableTemplates.graphql'
import PageRedirects from './queries/PageRedirects.graphql'
import RemovePageRedirect from './queries/RemovePageRedirect.graphql'
import Routes from './queries/Routes.graphql'

import './editbar.global.css'
import RedirectModal from './RedirectModal'

interface PageData {
  routes: Route[]
}

const CURRENT_ITEM_FROM_DEFAULT = 1
const CURRENT_ITEM_TO_DEFAULT = 10

// eslint-disable-next-line
class PageList extends Component<DataProps<PageData>> {
  public constructor() {
    super()
    this.state = {
      currentItemFrom: CURRENT_ITEM_FROM_DEFAULT,
      currentItemTo: CURRENT_ITEM_TO_DEFAULT,
      currentTab: 1,
      isModalOpen: false,
      selectedRedirectInfo: {
        active: false,
        endDate: null,
        fromUrl: '',
        toUrl: '',
      },
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

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

  public handleTabChange = (tabIndex: number) => {
    this.setState({
      currentTab: tabIndex,
    })
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

  public onCloseModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      selectedRedirectInfo: {},
    })
  }

  public handleInputChange = (inputData: any) => {
    this.setState({
      selectedRedirectInfo: {
        ...this.state.selectedRedirectInfo,
        ...inputData,
      },
    })
  }

  public handleRowClick = (event: Event) => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      selectedRedirectInfo: event.rowData,
    })
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

  public handleCreateRedirect = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    })
  }

  public handleDeleteRedirect = (event: Event) => {
    event.stopPropagation()
    const { removePageRedirect } = this.props
    removePageRedirect({
      variables: {
        id: 'redirect-config-id',
      },
    })
      .then((data: any) => {
        console.log('OK!', data)
      })
      .catch((err: any) => {
        alert('Error removing page redirect configuration.')
        console.log(err)
      })
  }

  public buildSchema = (pageRedirects: any) => {
    return {
      defaultSchema: {
        properties: {
          fromUrl: {
            title: <FormattedMessage id="pages.editor.info.from" />,
            type: 'string',
          },
          toUrl: {
            title: <FormattedMessage id="pages.editor.info.to" />,
            type: 'string',
          },
          endDate: {
            title: <FormattedMessage id="pages.editor.info.endDate" />,
            type: 'string',
          },
          active: {
            default: false,
            title: <FormattedMessage id="pages.editor.info.active" />,
            type: 'boolean',
          },
          remove: {
            type: 'object',
            title: <FormattedMessage id="pages.editor.info.remove" />,
            cellRenderer: (rowInfo: any) => {
              return (
                <div className="mh4">
                  <Button
                    variation="danger"
                    size="small"
                    onClick={this.handleDeleteRedirect}
                  >
                    <Delete size={10} color="#fff" />
                  </Button>
                </div>
              )
            },
          },
        },
        type: 'object',
      },
      items: pageRedirects,
    }
  }

  public renderRedirectList = pageRedirects => {
    const pageSchema = this.buildSchema(pageRedirects)
    const itemsQty = pageSchema.items.length
    const currentItemTo =
      itemsQty < this.state.currentItemTo ? itemsQty : this.state.currentItemTo

    const selectedItems = slice(
      this.state.currentItemFrom,
      this.state.currentItemTo,
      pageSchema.items,
    )
    return (
      <div className="mw8 mr-auto ml-auto mv6 ph6">
        <Button
          onClick={this.handleCreateRedirect}
          size="small"
          variation="primary"
        >
          <FormattedMessage id="pages.editor.info.new-redirect" />
        </Button>
        <Table
          schema={pageSchema.defaultSchema}
          items={selectedItems}
          onRowClick={this.handleRowClick}
        />
        <Pagination
          currentItemFrom={this.state.currentItemFrom}
          currentItemTo={currentItemTo}
          textOf="of"
          textShowRows="show rows"
          totalItems={itemsQty}
          onNextClick={() => {
            const defaultItemsToPlus =
              itemsQty < CURRENT_ITEM_TO_DEFAULT
                ? itemsQty
                : CURRENT_ITEM_TO_DEFAULT
            const newCurrentItemTo =
              this.state.currentItemTo + defaultItemsToPlus
            const currentItemTo =
              newCurrentItemTo > itemsQty ? itemsQty : newCurrentItemTo
            this.setState({
              currentItemFrom: this.state.currentItemTo,
              currentItemTo,
            })
          }}
          onPrevClick={() => {
            const defaultItemsMinus =
              itemsQty < CURRENT_ITEM_TO_DEFAULT
                ? itemsQty
                : CURRENT_ITEM_TO_DEFAULT
            const newItemFrom = this.state.currentItemFrom - defaultItemsMinus
            const newItemTo = this.state.currentItemTo - defaultItemsMinus
            const currentItemFrom =
              newItemFrom < CURRENT_ITEM_FROM_DEFAULT
                ? CURRENT_ITEM_FROM_DEFAULT
                : newItemFrom
            const currentItemTo =
              newItemTo < CURRENT_ITEM_TO_DEFAULT
                ? CURRENT_ITEM_TO_DEFAULT
                : newItemTo
            this.setState({ currentItemFrom, currentItemTo })
          }}
        />
      </div>
    )
  }

  public render() {
    const {
      conditions: { loading: loadingAvailableConditions },
      listPageRedirect: { loading: loadingPageRedirects, pageRedirects = [] },
      templates: {
        loading: loadingTemplates,
        availableTemplates: templates = [],
      },
      routes: { loading: loadingRoutes, routes = [] },
      params: { pageId: configurationId },
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
    const redirectList =
      !loadingPageRedirects && this.renderRedirectList(pageRedirects)

    const spinner = (loadingAvailableConditions ||
      loadingTemplates ||
      loadingPageRedirects ||
      loadingRoutes) && <span>Loading...</span>

    return (
      <div>
        <RedirectModal
          onClose={this.onCloseModal}
          isModalOpen={this.state.isModalOpen}
          redirectInfo={this.state.selectedRedirectInfo}
          handleInputChange={this.handleInputChange}
        />
        <Tabs>
          <Tab
            label="Pages"
            active={this.state.currentTab === 1}
            onClick={() => this.handleTabChange(1)}
          >
            <div className="mw8 mr-auto ml-auto mv6 ph6">
              {spinner || pageDetail || pageList}
            </div>
          </Tab>
          <Tab
            label="Redirects"
            active={this.state.currentTab === 2}
            onClick={() => this.handleTabChange(2)}
          >
            {spinner || redirectList}
          </Tab>
        </Tabs>
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
  graphql(PageRedirects, {
    name: 'listPageRedirect',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  graphql(RemovePageRedirect, {
    name: 'removePageRedirect',
    options: { fetchPolicy: 'cache-and-network' },
  }),
)(PageList)
