import { MutationFn, MutationUpdaterFn } from 'react-apollo'
import { RedirectsQuery } from '../typings'

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
) => MutationUpdaterFn<Mutations>

export type DeleteRedirectMutationFn = MutationFn<
  Redirect,
  DeleteRedirectVariables
>

export type SaveRedirectMutationFn = MutationFn<
  Redirect,
  SaveRedirectVariables
>
