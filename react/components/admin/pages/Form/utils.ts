import { DataProxy } from 'apollo-cache'
import { RouteFormData } from 'pages'
import { pathOr } from 'ramda'

import Routes from '../../../../queries/Routes.graphql'
import Route from '../../../../queries/Route.graphql'
import { DateVerbOptions } from '../../../../utils/conditions/typings'
import {
  DateInfoFormat,
  DateStatementFormat,
  DeleteMutationResult,
  QueryData,
  RoutesQuery,
  SaveMutationResult,
} from './typings'
import { DATA_SOURCE } from '../consts'

const routesCacheAccessParameters = (bindingId?: string) => ({
  query: Routes,
  variables: {
    domain: 'store',
    bindingId,
  },
})

const routeCacheAccessParameters = (routeId: string, bindingId?: string) => ({
  query: Route,
  variables: {
    domain: 'store',
    routeId,
    bindingId,
  },
})

const logCacheError = () => {
  console.warn('No cache found for "Routes".')
}

const readRoutesFromStore = (store: DataProxy, binding?: string): QueryData =>
  store.readQuery(routesCacheAccessParameters(binding))

const writeRoutesToStore = (
  newData: RoutesQuery,
  store: DataProxy,
  bindingId?: string,
  updatedRoute?: Route
) => {
  store.writeQuery({
    data: newData,
    ...routesCacheAccessParameters(bindingId),
  })
  if (updatedRoute) {
    store.writeQuery({
      data: { route: updatedRoute },
      ...routeCacheAccessParameters(updatedRoute.routeId, bindingId),
    })
  }
}

export const updateStoreAfterDelete = (binding?: string) => (
  store: DataProxy,
  result: DeleteMutationResult
) => {
  const deletedPageId = result.data && result.data.deleteRoute

  try {
    const queryData = readRoutesFromStore(store, binding)

    if (queryData) {
      const routes = queryData.routes

      const newRoutes = routes.filter(({ uuid }) => uuid !== deletedPageId)

      const newData = {
        ...queryData,
        routes: newRoutes || routes,
      }

      writeRoutesToStore(newData, store, binding)
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
    const binding = savedRoute?.binding
    const queryData = readRoutesFromStore(store, binding)

    if (queryData && savedRoute) {
      const routes = queryData.routes

      const savedRouteId = savedRoute && savedRoute.uuid
      const matchedRoute = routes.find(route => route.uuid === savedRouteId)
      const appRouteIdx = routes.findIndex(
        route =>
          route.declarer && !route.binding && route.path === savedRoute.path
      )

      if (matchedRoute) {
        const idx = routes.indexOf(matchedRoute)
        routes[idx] = savedRoute
      } else {
        routes.push(savedRoute)
      }

      if (appRouteIdx !== -1) {
        routes.splice(appRouteIdx, 1)
      }

      const newData = {
        ...queryData,
        routes,
      }

      writeRoutesToStore(newData, store, binding, savedRoute)
    }
  } catch (err) {
    logCacheError()
  }
}

const getConditionStatementObject = (
  objectJson: string,
  verb: DateVerbOptions
): Partial<DateStatementFormat> => {
  const dateInfoStringValues: DateInfoFormat = JSON.parse(objectJson)

  return {
    between: {
      from: new Date(dateInfoStringValues.from),
      to: new Date(dateInfoStringValues.to),
    },
    from: {
      date: new Date(dateInfoStringValues.from),
    },
    is: {
      date: new Date(dateInfoStringValues.from),
    },
    to: {
      date: new Date(dateInfoStringValues.to),
    },
  }[verb]
}

export const formatToFormData = (route: Route): RouteFormData => {
  return {
    ...route,
    metaTagDescription: pathOr('', ['metaTags', 'description'], route),
    metaTagKeywords: pathOr<string[], string[]>(
      [],
      ['metaTags', 'keywords'],
      route
    ).map(keyword => ({ label: keyword, value: keyword })),
    pages: route.pages.map((page, index) => ({
      ...page,
      condition: {
        ...page.condition,
        statements: page.condition.statements.map(
          ({ verb, subject, objectJSON }) => ({
            error: '',
            object: getConditionStatementObject(
              objectJSON,
              verb as DateVerbOptions
            ),
            subject,
            verb,
          })
        ),
      },
      operator: page.condition.allMatches ? 'all' : 'any',
      uniqueId: index,
    })),
    dataSource: DATA_SOURCE,
  }
}

export const generateNewRouteId = (interfaceId: string, path: string) => {
  return `${interfaceId}#${path.replace(
    /\//gi,
    (_, offset: number, fullString: string) => {
      return offset === 0 || offset === fullString.length - 1 ? '' : '-'
    }
  )}`
}
