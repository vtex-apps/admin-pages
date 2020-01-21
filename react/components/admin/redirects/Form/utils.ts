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

const readRedirectsFromStore = (store: DataProxy): QueryData =>
  store.readQuery(cacheAccessParameters)

const writeRedirectsToStore = (newData: RedirectsQuery, store: DataProxy) => {
  store.writeQuery({
    data: newData,
    ...cacheAccessParameters,
  })
}

export const getStoreUpdater: StoreUpdaterGetter = operation => (
  store,
  result
) => {
  const deleteRedirect =
    result.data && result.data.redirect && result.data.redirect.delete
  const saveRedirect =
    result.data && result.data.redirect && result.data.redirect.save

  const isDelete = operation === 'delete'

  try {
    const queryData = readRedirectsFromStore(store)

    if (queryData) {
      const newRedirects =
        (isDelete
          ? deleteRedirect &&
            queryData.redirect.list.filter(
              redirect => redirect.from !== deleteRedirect.from
            )
          : saveRedirect &&
            queryData.redirect.list.reduce(
              (acc, currRedirect) =>
                currRedirect.from === saveRedirect.from
                  ? acc
                  : [...acc, currRedirect],
              [saveRedirect]
            )) || queryData.redirect.list

      const newData = {
        ...queryData,
        redirect: {
          ...queryData.redirect,
          list: newRedirects,
          numberOfEntries: isDelete
            ? queryData.redirect.numberOfEntries - 1
            : queryData.redirect.numberOfEntries + 1,
        },
      }

      writeRedirectsToStore(newData, store)
    }
  } catch (err) {
    console.warn('No cache found for "Redirects".')
  }

  try {
    store.writeQuery({
      data: { redirect: isDelete ? undefined : { save: saveRedirect } },
      query: Redirect,
      variables: {
        path: isDelete
          ? deleteRedirect && deleteRedirect.from
          : saveRedirect && saveRedirect.from,
      },
    })
  } catch (e) {
    console.error('Error writing to "Redirect".')
  }
}
