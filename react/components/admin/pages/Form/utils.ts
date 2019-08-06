import { DataProxy } from 'apollo-cache'
import { RouteFormData } from 'pages'
import { indexBy, pathOr, pickBy, prop, values } from 'ramda'
import { ConditionsOperator } from 'vtex.styleguide'

import Routes from '../../../../queries/Routes.graphql'
import { DateVerbOptions } from '../../../../utils/conditions/typings'

import {
  DateInfoFormat,
  DateStatementFormat,
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
  console.warn('No cache found for "Routes".')
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
        ...(savedRoutePath
          ? {
              [savedRoutePath]: {
                ...routesByPath[savedRoutePath],
                ...pickBy(val => val != null, savedRoute || {}),
              },
            }
          : null),
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
      operator: page.condition.allMatches
        ? 'all'
        : ('any' as ConditionsOperator),
      uniqueId: index,
    })),
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
