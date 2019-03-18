import { DataProxy } from 'apollo-cache'
import { indexBy, prop, values } from 'ramda'

import Routes from '../../../../queries/Routes.graphql'

import {
  DeleteMutationResult,
  QueryData,
  RoutesQuery,
  SaveMutationResult,
} from './typings'

const cacheAccessParameters = {
  query: Routes,
  variables: {
    domain: 'store',
  },
}

const logCacheError = () => {
  console.log('No cache found for "Routes".')
}

const readRedirectsFromStore = (store: DataProxy): QueryData =>
  store.readQuery(cacheAccessParameters)

const writeRedirectsToStore = (newData: RoutesQuery, store: DataProxy) => {
  store.writeQuery({
    data: newData,
    ...cacheAccessParameters,
  })
}

export const updateStoreAfterDelete = (
  store: DataProxy,
  result: DeleteMutationResult
) => {
  const deletedPageId = result.data && result.data.deleteRoute

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const routes = queryData.routes

      const newRoutes = routes.filter(({ uuid }) => uuid !== deletedPageId)

      const newData = {
        ...queryData,
        routes: newRoutes || routes,
      }

      writeRedirectsToStore(newData, store)
    }
  } catch (err) {
    logCacheError()
  }
}

export const updateStoreAfterSave = (
  store: DataProxy,
  result: SaveMutationResult
) => {
  const savedRoute = result.data && result.data.saveRoute

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const routes = queryData.routes

      const savedRoutePath = savedRoute && savedRoute.path
      const routesByPath = indexBy(prop<Route, 'path'>('path'), routes)

      const newRoutesByPath = {
        ...routesByPath,
        ...(savedRoutePath ? { [savedRoutePath]: savedRoute } : null),
      }
      const newRoutes = values(newRoutesByPath)

      const newData = {
        ...queryData,
        routes: newRoutes,
      }

      writeRedirectsToStore(newData, store)
    }
  } catch (err) {
    logCacheError()
  }
}
