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
