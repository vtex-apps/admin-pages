import { QueryResult } from 'react-apollo'

export type DropdownOptions = {
  label: string
  value: string
}[]

export type DropdownValue = string

type BaseAddress = string

type Locale = string

interface Binding {
  canonicalBaseAddress: string
  id: string
  supportedLocales: Locale[]
  targetProduct: string
}

interface TenantInfo {
  bindings: Binding[]
}

export interface TenantInfoData {
  tenantInfo: TenantInfo
}

interface QueryState extends Pick<QueryResult<TenantInfoData>, 'data'> {
  hasError: boolean
  isLoading: QueryResult<TenantInfoData>['loading']
}

export type QueryStateReducer = (
  prevState: QueryState,
  state: Partial<QueryState>
) => QueryState
