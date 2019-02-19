import { DataProxy } from 'apollo-cache'

import Routes from '../../../../queries/Routes.graphql'

import {
  DeleteMutationResult,
  QueryData,
  RoutesQuery,
  SaveMutationResult,
} from './typings'

const cacheAccessParameters = {
  query: Routes,
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
  result: DeleteMutationResult,
) => {
  const deletedPageId = result.data && result.data.deleteRoute

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const routes = queryData.routes
      const routesKeys = Object.keys(routes)

      const newRoutes =
        deletedPageId &&
        routesKeys.reduce(
          (acc, currKey) =>
            routes[currKey].uuid === deletedPageId
              ? acc
              : { ...acc, [currKey]: routes[currKey] },
          {},
        )

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
  result: SaveMutationResult,
) => {
  const savedRoute = result.data && result.data.saveRoute

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const routes = queryData.routes

      const newRoutes = savedRoute && { ...routes, [savedRoute.uuid || '']: savedRoute }

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
