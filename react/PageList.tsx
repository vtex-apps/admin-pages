import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'

import AdminWrapper from './components/admin/AdminWrapper'
import { WRAPPER_PATH } from './components/admin/pages/consts'
import List from './components/admin/pages/List'
import { CategorizedRoutes } from './components/admin/pages/List/typings'
import { isStoreRoute } from './components/admin/pages/utils'
import Loader from './components/Loader'
import RoutesQuery from './queries/Routes.graphql'

interface QueryData {
  routes: Route[]
}

class PageList extends PureComponent {
  public static contextTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  public render() {
    const { startLoading, stopLoading } = this.context

    return (
      <AdminWrapper targetPath={WRAPPER_PATH}>
        <Query<QueryData> query={RoutesQuery} variables={{ domain: 'store' }}>
          {({ data, loading: isLoading }) => {
            if (isLoading) {
              startLoading()

              return <Loader />
            }

            stopLoading()

            const routes = data && data.routes

            const storeRoutes = routes
              ? routes.filter(route => isStoreRoute(route.domain))
              : []

            const categorizedRoutes = storeRoutes.reduce(
              (acc: CategorizedRoutes, currRoute: Route) => {
                const currRouteContext = currRoute.context || ''

                if (currRouteContext.endsWith('SearchContext')) {
                  return {
                    ...acc,
                    multipleProducts: [...acc.multipleProducts, currRoute],
                  }
                }

                if (currRouteContext.endsWith('ProductContext')) {
                  return {
                    ...acc,
                    singleProduct: [...acc.singleProduct, currRoute],
                  }
                }

                return { ...acc, noProducts: [...acc.noProducts, currRoute] }
              },
              {
                multipleProducts: [],
                noProducts: [],
                singleProduct: [],
              }
            )

            return <List categorizedRoutes={categorizedRoutes} />
          }}
        </Query>
      </AdminWrapper>
    )
  }
}

export default PageList
