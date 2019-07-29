import startCase from 'lodash.startcase'

type NewRouteTypeArg = Pick<Route, 'uuid' | 'declarer'>
export const isNewRoute = (route: NewRouteTypeArg) =>
  !route.uuid && !route.declarer

export const isUserRoute = (route: NewRouteTypeArg) => !route.declarer

type GetRouteTitleArg = Pick<Route, 'title' | 'blockId' | 'interfaceId'> &
  NewRouteTypeArg

export const getRouteTitle = (route: GetRouteTitleArg) => {
  const { blockId, declarer, interfaceId, title } = route

  const nameFromInterfaceOrBlock = startCase(
    blockId.split('#')[1] ||
      interfaceId.split('.')[interfaceId.split('.').length - 1]
  )

  if (isNewRoute(route)) {
    return title || ''
  }

  return declarer
    ? nameFromInterfaceOrBlock || title
    : title || nameFromInterfaceOrBlock
}

export const isStoreRoute = (domain: Route['domain']) => domain === 'store'
