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

export interface TemplateMutationResult {
  data?: {
    availableTemplates: Template[]
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
  route: Partial<Route> &
    Pick<Route, 'declarer' | 'domain' | 'path' | 'routeId'>
}

export interface DeleteRouteVariables {
  uuid: string
}

export interface DateInfoFormat {
  date: string
  to: string
  from: string
}

export type DateStatementFormat = Record<keyof DateInfoFormat, Date>

export type FormErrors = Omit<
  Partial<{ [key in keyof Route]: key }>,
  'pages'
> & {
  pages?: {
    [key: string]: {
      template?: string
      condition?: string
    }
  }
}
