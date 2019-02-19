export const sortRoutes = (routes: Route[]) =>
  routes.sort((a, b) => a.interfaceId.localeCompare(b.interfaceId))
