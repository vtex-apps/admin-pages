import { MutationFn, MutationUpdaterFn } from 'react-apollo'

import { RedirectsQuery } from '../typings'

export interface MutationResult {
  data?: {
    [name: string]: Redirect
  }
}

export type QueryData = RedirectsQuery | null

export interface RedirectQuery {
  redirect: {
    get: Redirect
  }
}

export interface DeleteRedirectVariables {
  path: string
}

export interface SaveRedirectVariables {
  id?: string
  endDate: string | null
  from: string
  to: string
  type: RedirectTypes
  binding?: string
}

interface Mutations {
  redirect?: {
    delete?: Redirect
    save?: Redirect
  }
}

export type StoreUpdaterGetter = (
  operation: 'delete' | 'save'
) => MutationUpdaterFn<Mutations>

export interface DeleteRedirectData {
  redirect: {
    delete: Redirect
  }
}

export type DeleteRedirectMutationFn = MutationFn<
  DeleteRedirectData,
  DeleteRedirectVariables
>

export interface SaveRedirectData {
  redirect: {
    save: Redirect
  }
}

export type SaveRedirectMutationFn = MutationFn<
  SaveRedirectData,
  SaveRedirectVariables
>
