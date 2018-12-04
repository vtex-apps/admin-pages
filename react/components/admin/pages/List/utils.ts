export const sortRoutes = (routes: Route[]) =>
  routes.sort((a, b) => a.id.localeCompare(b.id))
