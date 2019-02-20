declare module 'pages' {
  import { ConditionsProps } from 'vtex.styleguide'

  type ConditionsOperators = NonNullable<ConditionsProps['operator']>

  interface Statements {
    subject: string
    verb: string
    object: any
    error: any
  }

  interface ConditionFormsData {
    id?: string
    allMatches: boolean
    statements: Statements[]
  }

  type PagesFormData = Omit<Page, 'condition'> & {
    condition: ConditionFormsData
    uniqueId: number
    operator: ConditionsOperators
    template: string
  }

  type RouteFormData = Omit<Route, 'pages'> & {
    pages: PagesFormData[]
  }
}
å