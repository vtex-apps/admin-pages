import { ApolloClient } from 'apollo-client'
import { DocumentNode } from 'graphql'
import { WithApolloClient } from 'react-apollo'

export type CatalogEntity = 'brand' | 'category' | 'collection' | 'department'

export type EntityData = Record<string, NativeType[]>

export interface InitialDataProps {
  initialData?: object & NativeType
  isInitialDataLoading: boolean
}

export interface InitializerArgs {
  client: ApolloClient<InitialQueryData>
  id?: NativeType['id']
  query: DocumentNode
}

type InitialQueryData = Record<CatalogEntity, NativeType>

export interface InitializerState {
  data?: InitialDataProps['initialData']
  isLoading: InitialDataProps['isInitialDataLoading']
}

export interface Input {
  inputValue?: string
}

export interface NativeType {
  id: string
  name: string
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
