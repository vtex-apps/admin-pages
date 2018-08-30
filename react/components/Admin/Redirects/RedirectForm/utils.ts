interface RedirectsQuery {
  redirects: {
    redirects: Redirect[]
    total: number
  }
}

type QueryData = RedirectsQuery | null

export const readRedirectsFromStore = (
  redirectsQuery: RedirectsQuery,
  store: any,
): QueryData =>
  store.readQuery({
    query: redirectsQuery,
    variables: { from: 0, to: 999 },
  })

export const writeRedirectsToStore = (
  newData: RedirectsQuery,
  redirectsQuery: RedirectsQuery,
  store: any,
) => {
  store.writeQuery({
    data: newData,
    query: redirectsQuery,
    variables: { from: 0, to: 999 },
  })
}
