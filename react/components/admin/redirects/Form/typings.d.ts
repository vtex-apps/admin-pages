import { MutationFunction } from 'react-apollo'
import { RedirectsQuery } from '../typings'
import { MutationUpdaterFn } from 'apollo-client'

export interface MutationResult {
  data?: {
    [name: string]: Redirect
  }
}

export type QueryData = RedirectsQuery | null

export interface RedirectQuery {
  redirect?: Redirect
}

export interface DeleteRedirectVariables {
  id: string
}

export interface SaveRedirectVariables {
  id?: string
  endDate: string
  from: string
  to: string
  type: RedirectTypes
}

interface Mutations {
  deleteRedirect?: Redirect
  saveRedirect?: Redirect
}

export type StoreUpdaterGetter = (
  operation: 'delete' | 'save'
) => MutationUpdaterFn<any>

export type RedirectData = Redirect | undefined

export type DeleteRedirectMutationFn = MutationFunction<
  RedirectData,
  DeleteRedirectVariables
>

export type SaveRedirectMutationFn = MutationFunction<
  RedirectData,
  SaveRedirectVariables
>
