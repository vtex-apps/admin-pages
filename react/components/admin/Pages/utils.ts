import { NEW_ROUTE_ID } from './consts'

export const isNewRoute = (routeId: string) => routeId === NEW_ROUTE_ID

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export const getRouteTitle = (route: Route) =>
  route.title ||
  (!isNewRoute(route.id) && isStoreRoute(route.id)
    ? capitalize(route.id.split('store/')[1])
    : '')

export const isStoreRoute = (routeId: string) =>
  /^store\/.+$/.test(routeId)
