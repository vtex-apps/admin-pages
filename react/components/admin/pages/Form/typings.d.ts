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
  routes: Route[]
}

export interface ClientSideUniqueId {
  uniqueId: number
  operator: ConditionsProps['operator']
}

interface StatementsOnSaveRoute {
  subject: string
  verb: string
  objectJSON: string
}

interface ConditionsOnSaveRouteVariables {
  id?: string
  allMatches: boolean
  statements: StatementsOnSaveRoute[]
}

export interface SaveRouteVariables {
  route: Route
}

export type DateVerbOptions = 'between' | 'from' | 'is' | 'to'
