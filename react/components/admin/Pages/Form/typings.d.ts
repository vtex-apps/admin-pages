export interface DeleteMutationResult {
  data?: {
    deleteRoute: string
  }
}

export interface SaveMutationResult {
  data?: {
    saveRoute: Route
  }
}

export type QueryData = RoutesQuery | null

export interface RoutesQuery {
  routes: Routes
}
