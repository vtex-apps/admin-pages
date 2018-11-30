import { RedirectsQuery } from '../typings'

export interface FetchMoreOptions {
  updateQuery: (prevData: RedirectsQuery, newData: UpdateQueryNewData) => void
  variables: QueryVariables
}

interface QueryVariables {
  from: number
  to: number
}

interface UpdateQueryNewData {
  fetchMoreResult?: RedirectsQuery
}
