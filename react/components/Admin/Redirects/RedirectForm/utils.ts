import { PAGINATION_START, PAGINATION_STEP } from '../consts'

interface RedirectsQuery {
  redirects: {
    redirects: Redirect[]
    total: number
  }
}

type QueryData = RedirectsQuery | null

const VARIABLES = {
  from: PAGINATION_START,
  to: PAGINATION_START + PAGINATION_STEP,
}

export const readRedirectsFromStore = (
  redirectsQuery: RedirectsQuery,
  store: any,
): QueryData =>
  store.readQuery({
    query: redirectsQuery,
    variables: VARIABLES,
  })

export const writeRedirectsToStore = (
  newData: RedirectsQuery,
  redirectsQuery: RedirectsQuery,
  store: any,
) => {
  store.writeQuery({
    data: newData,
    query: redirectsQuery,
    variables: VARIABLES,
  })
}
