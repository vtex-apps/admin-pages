import { ApolloClient } from 'apollo-client'
import { DocumentNode } from 'graphql'
import { WithApolloClient } from 'react-apollo'

export interface CatalogEntity {
  id: string
  name: string
}

export type CatalogEntityName =
  | 'brand'
  | 'category'
  | 'collection'
  | 'department'

export type EntityData = Record<string, CatalogEntity[]>

export interface InitialDataProps {
  initialData?: object & CatalogEntity
  isInitialDataLoading: boolean
}

export interface InitializerArgs {
  client: ApolloClient<InitialQueryData>
  id?: CatalogEntity['id']
  query: DocumentNode
}

type InitialQueryData = Record<CatalogEntityName, CatalogEntity>

export interface InitializerState {
  data?: InitialDataProps['initialData']
  isLoading: InitialDataProps['isInitialDataLoading']
}

export interface Input {
  inputValue?: string
}

export interface Option {
  label: string
  value: string
}

export interface SearchInputChangeHandlerGetterArgs {
  client: ApolloClient<EntityData>
  query: DocumentNode
  setState: (newState: Partial<State>) => void
}
