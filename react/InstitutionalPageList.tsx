import React, { useEffect, useMemo } from 'react'
import { Query } from 'react-apollo'

import { WRAPPER_PATH } from './components/admin/pages/consts'
import Section from './components/admin/pages/List/Section'
import { useTargetPathContext } from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import RoutesQuery from './queries/Routes.graphql'

import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface QueryData {
  routes: Route[]
}

interface PageListProps {
  data?: QueryData
  isLoading: boolean
}

const PageListWithQuery = () => {
  return (
    <Query<QueryData> query={RoutesQuery} variables={{ domain: 'store' }}>
      {({ data, loading: isLoading }) => {
        return <PageList isLoading={isLoading} data={data} />
      }}
    </Query>
  )
}

const PageList: React.FunctionComponent<PageListProps> = ({ data, isLoading }) => {
  const { startLoading, stopLoading } = useAdminLoadingContext()
  const { setTargetPath } = useTargetPathContext()

  useEffect(() => {
    setTargetPath('institutional')
  }, [])

  useEffect(
    () => {
      if (isLoading) {
        startLoading()
      } else {
        stopLoading()
      }
    },
    [isLoading]
  )

  const institutionalRoutes = useMemo(
    () => {
      const routes = data && data.routes
      return (routes || []).filter((currRoute: Route) => {
        const currRouteContext = currRoute.context || ''
        return !(
          currRouteContext.endsWith('SearchContext') ||
          currRouteContext.endsWith('ProductContext') ||
          currRoute.blockId.indexOf('custom') <= 0
        )
      })
    },
    [data]
  )

  if (isLoading) {
    return <Loader />
  }

  return (
    <Section
      hasCreateButton
      routes={institutionalRoutes}
      titleId="admin/pages.admin.pages.list.section.standard"
    />
  )
}

export default React.memo(PageListWithQuery)
