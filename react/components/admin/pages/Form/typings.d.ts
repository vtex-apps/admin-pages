import { ConditionsProps } from 'vtex.styleguide'

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

export interface ClientSideUniqueId {
  uniqueId: number
  operator: ConditionsProps['operator']
}

export type PageWithUniqueId = Page & ClientSideUniqueId
