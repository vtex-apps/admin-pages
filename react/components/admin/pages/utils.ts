import startCase from 'lodash.startcase'

export const isNewRoute = (route: Route) => !route.uuid && !route.declarer

export const getRouteTitle = (route: Route) => {
  if(isNewRoute(route)) {
    return route.title || ''
  }
  return route.title || startCase(route.blockId.split('#')[1] || route.interfaceId.split('.')[route.interfaceId.split('.').length - 1])
}

export const isStoreRoute = (domain: string) => domain === 'store'
