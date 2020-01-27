import React, { useEffect, useMemo } from 'react'
import { Query } from 'react-apollo'

import { WRAPPER_PATH } from './components/admin/pages/consts'
import List from './components/admin/pages/List'
import { CategorizedRoutes } from './components/admin/pages/List/typings'
import { isStoreRoute } from './components/admin/pages/utils'
import { useTargetPathContext } from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import RoutesQuery from './queries/Routes.graphql'

import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface QueryData {
  routes: Route[]
}

interface PageListProps {
  data?: QueryData
  isLoading: boolean
}

const PageListWithQuery = () => {
  return (
    <Query<QueryData> query={RoutesQuery} variables={{ domain: 'store' }}>
      {({ data, loading: isLoading }) => {
        return <PageList isLoading={isLoading} data={data} />
      }}
    </Query>
  )
}

const PageList: React.FunctionComponent<PageListProps> = ({
  data,
  isLoading,
}) => {
  const { startLoading, stopLoading } = useAdminLoadingContext()
  const { setTargetPath } = useTargetPathContext()

  useEffect(() => {
    setTargetPath(WRAPPER_PATH)
  }, [setTargetPath])

  useEffect(() => {
    if (isLoading) {
      startLoading()
    } else {
      stopLoading()
    }
  }, [isLoading, startLoading, stopLoading])

  const categorizedRoutes = useMemo(() => {
    const routes = data && data.routes

    const storeRoutes = routes
      ? routes.filter(route => isStoreRoute(route.domain))
      : []

    return storeRoutes.reduce(
      (acc: CategorizedRoutes, currRoute: Route) => {
        const currRouteContext = currRoute.context || ''

        if (currRoute.interfaceId.endsWith('store.not-found')) {
          return {
            ...acc,
            notFoundSection: [...acc.notFoundSection, currRoute],
          }
        }

        if (currRouteContext.endsWith('ContentPageContext')) {
          return acc
        }

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
        notFoundSection: [],
      }
    )
  }, [data])

  return !isLoading ? (
    <List categorizedRoutes={categorizedRoutes} />
  ) : (
    <Loader />
  )
}

export default React.memo(PageListWithQuery)
