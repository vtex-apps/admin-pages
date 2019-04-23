import { DataProxy } from 'apollo-cache'

import Redirect from '../../../../queries/Redirect.graphql'
import Redirects from '../../../../queries/Redirects.graphql'
import { PAGINATION_START, PAGINATION_STEP } from '../consts'
import { RedirectsQuery } from '../typings'

import { QueryData, StoreUpdaterGetter } from './typings'

const cacheAccessParameters = {
  query: Redirects,
  variables: {
    from: PAGINATION_START,
    to: PAGINATION_START + PAGINATION_STEP,
  },
}

export const getStoreUpdater: StoreUpdaterGetter = operation => (
  store,
  result
) => {
  const deleteRedirect = result.data && result.data.deleteRedirect
  const saveRedirect = result.data && result.data.saveRedirect

  const isDelete = operation === 'delete'

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const newRedirects =
        (isDelete
          ? deleteRedirect &&
            queryData.redirects.redirects.filter(
              redirect => redirect.id !== deleteRedirect.id
            )
          : saveRedirect &&
            queryData.redirects.redirects.reduce(
              (acc, currRedirect) =>
                currRedirect.id === saveRedirect.id
                  ? acc
                  : [...acc, currRedirect],
              [saveRedirect]
            )) || queryData.redirects.redirects

      const newTotal =
        newRedirects.length !== queryData.redirects.redirects.length
          ? isDelete
            ? queryData.redirects.total - 1
            : queryData.redirects.total + 1
          : queryData.redirects.total

      const newData = {
        ...queryData,
        redirects: {
          ...queryData.redirects,
          redirects: newRedirects,
          total: newTotal,
        },
      }

      writeRedirectsToStore(newData, store)
    }
  } catch (err) {
    console.log('No cache found for "Redirects".')
  }

  try {
    store.writeQuery({
      data: { redirect: isDelete ? undefined : saveRedirect },
      query: Redirect,
      variables: {
        id: isDelete
          ? deleteRedirect && deleteRedirect.id
          : saveRedirect && saveRedirect.id,
      },
    })
  } catch (e) {
    console.log('Error writing to "Redirect".')
  }
}

const readRedirectsFromStore = (store: DataProxy): QueryData =>
  store.readQuery(cacheAccessParameters)

const writeRedirectsToStore = (newData: RedirectsQuery, store: DataProxy) => {
  store.writeQuery({
    data: newData,
    ...cacheAccessParameters,
  })
}
