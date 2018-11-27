import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'

import List from './components/admin/Pages/List'
import { CategorizedRoutes } from './components/admin/Pages/List/typings'
import { isStoreRoute } from './components/admin/Pages/utils'
import Styles from './components/admin/Styles'
import Loader from './components/Loader'
import RoutesQuery from './queries/Routes.graphql'

interface QueryResponse {
  data?: {
    routes: Route[]
  }
  loading: boolean
}

class PageList extends PureComponent {
  public static contextTypes = {
    startLoading: PropTypes.func.isRequired,
    stopLoading: PropTypes.func.isRequired,
  }

  public render() {
    const { startLoading, stopLoading } = this.context

    return (
      <Styles>
        <Query query={RoutesQuery}>
          {({ data, loading: isLoading }: QueryResponse) => {
            if (isLoading) {
              startLoading()

              return <Loader />
            }

            stopLoading()

            const routes = data && data.routes

            const storeRoutes = routes
              ? routes.filter(route => isStoreRoute(route.id))
              : []

            const categorizedRoutes = storeRoutes.reduce(
              (acc: CategorizedRoutes, currRoute: Route) => {
                const currRouteContext = currRoute.context || ''

                if (currRouteContext.endsWith('ProductSearchContextProvider')) {
                  return {
                    ...acc,
                    multipleProducts: [...acc.multipleProducts, currRoute],
                  }
                }

                if (currRouteContext.endsWith('ProductContextProvider')) {
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
              },
            )

            return <List categorizedRoutes={categorizedRoutes} />
          }}
        </Query>
      </Styles>
    )
  }
}

export default PageList
