export interface MutationResult {
  data?: {
    [name: string]: Redirect
  }
}

export type QueryData = RedirectsQuery | null

export interface RedirectQuery {
  redirect?: Redirect
}

export interface RedirectsQuery {
  redirects: {
    redirects: Redirect[]
    total: number
  }
}
