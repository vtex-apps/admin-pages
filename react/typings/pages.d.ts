declare module 'pages' {
  import { ConditionsProps } from 'vtex.styleguide'

  type ConditionsOperators = NonNullable<ConditionsProps['operator']>

  interface Statements {
    subject: string
    verb: string
    object: Record<string, unknown>
    error: unknown
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

  interface KeywordsFormData {
    value: string
    label: string
  }

  type RouteFormData = Omit<Route, 'pages' | 'metaTags'> & {
    pages: PagesFormData[]
    metaTagDescription?: string
    metaTagRobots?: string
    metaTagKeywords?: KeywordsFormData[]
  }
}
