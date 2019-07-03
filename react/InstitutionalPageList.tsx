import React, { useEffect, useMemo } from 'react'
import { Query } from 'react-apollo'

import { PageHeader } from 'vtex.styleguide'

import Section from './components/admin/pages/List/Section'
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
    <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
      <div className="center mw8">
        <PageHeader title="Institucional" />
        <div className="ph7">
          <Section
            hasCreateButton
            routes={institutionalRoutes}
            titleId="admin/pages.admin.pages.list.section.standard"
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(PageListWithQuery)
