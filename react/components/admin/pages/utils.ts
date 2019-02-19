import startCase from 'lodash.startcase'

type NewRouteTypeArg = Pick<Route, 'uuid' | 'declarer'>
export const isNewRoute = (route: NewRouteTypeArg) => !route.uuid && !route.declarer

type GetRouteTitleArg = Pick<Route, 'title' | 'blockId' | 'interfaceId'> & NewRouteTypeArg
export const getRouteTitle = (route: GetRouteTitleArg) => {
  if(isNewRoute(route)) {
    return route.title || ''
  }
  return route.title || startCase(route.blockId.split('#')[1] || route.interfaceId.split('.')[route.interfaceId.split('.').length - 1])
}

export const isStoreRoute = (domain: Route['domain']) => domain === 'store'
