import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import PageEditor from './components/PageEditor'
import AvailableTemplates from './queries/AvailableTemplates.graphql'
import Page from './queries/Page.graphql'
import Pages from './queries/Pages.graphql'

// eslint-disable-next-line
class PageDetail extends Component {
  public static propTypes = {
    data: PropTypes.object,
    params: PropTypes.object,
  }

  public static contextTypes = {
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
    this.props.data && this.props.data.loading ? this.context.startLoading() : this.context.stopLoading()
  }

  public render() {
    const {
      page: { loading: loadingPage, page: pageData } = {},
      routes: { loading: loadingRoutes, pages: routes } = {},
      availableTemplates: { loading: loadingTemplates, availableTemplates },
      params: { name },
    } = this.props

    if (loadingPage || loadingRoutes || loadingTemplates) {
      return (
        <span>Loading...</span>
      )
    }

    const isNew = name === 'new'
    const pagesJSON = pageData && pageData.pagesJSON
    const extensionsJSON = pageData && pageData.extensionsJSON
    const pages = !isNew && pagesJSON && JSON.parse(pagesJSON)
    const extensions = !isNew && extensionsJSON && JSON.parse(extensionsJSON)
    const page = pages && pages[name] || undefined
    const declarer = page && page.declarer || undefined
    const path = page && page.path || undefined
    const component = page && extensions[name] && extensions[name].component || undefined

    return (
      <div className="ph5 mw7 mr-auto ml-auto pt6">
        <h1>{page ? 'Page detail' : 'Create new page'}</h1>
        <PageEditor
          name={isNew ? null : name}
          path={path}
          declarer={declarer}
          component={component}
          routes={routes}
          availableTemplates={availableTemplates}
        />
      </div>
    )
  }
}

export default compose(
  graphql(Page, {
    name: 'page',
    options: (props) => ({
      variables: {
        locale: global.__RUNTIME__.culture.locale,
        page: props.params.name,
      },
    }),
    skip: (props) => props.params.name === 'new',
  }),
  graphql(AvailableTemplates, {
    name: 'availableTemplates',
    options: (props) => ({
      variables: {
        pageName: props.params.name,
        production: false,
        renderMajor: 7,
      },
    }),
  }),
  graphql(Pages, {
    name: 'routes',
    skip: (props) => props.params.name !== 'new'
  }),
)(PageDetail)
