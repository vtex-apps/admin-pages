import React, { useEffect, useMemo } from 'react'
import { Query } from 'react-apollo'
import { InjectedIntl, injectIntl } from 'react-intl'

import { PageHeader } from 'vtex.styleguide'

import Loader from './components/admin/institutional/Form/Loader'
import List from './components/admin/institutional/List/index'
import RoutesQuery from './queries/Routes.graphql'

import { useAdminLoadingContext } from './utils/AdminLoadingContext'

interface QueryData {
  routes: Route[]
}

interface PageListProps {
  data?: QueryData
  isLoading: boolean
  intl: InjectedIntl
}

const PageListWithQuery = () => {
  return (
    <Query<QueryData> query={RoutesQuery} variables={{ domain: 'store' }}>
      {({ data, loading: isLoading }) => {
        return <PageListWithIntl isLoading={isLoading} data={data} />
      }}
    </Query>
  )
}

const PageList: React.FunctionComponent<PageListProps> = ({
  data,
  isLoading,
  intl,
}) => {
  const { startLoading, stopLoading } = useAdminLoadingContext()

  useEffect(() => {
    if (isLoading) {
      startLoading()
    } else {
      stopLoading()
    }
  }, [isLoading, startLoading, stopLoading])

  const institutionalRoutes = useMemo(() => {
    const routes = data && data.routes
    return (routes || []).filter((currRoute: Route) => {
      return (currRoute.context || '').endsWith('ContentPageContext')
    })
  }, [data])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
      <div className="center mw8">
        <PageHeader
          title={intl.formatMessage({
            defaultMessage: 'Institutional',
            id: 'admin/pages.admin-menu-button.content-pages',
          })}
        />
        <div className="ph7">
          <List
            hasCreateButton
            routes={institutionalRoutes}
            titleId="admin/pages.admin.pages.list.section.standard"
          />
        </div>
      </div>
    </div>
  )
}

const PageListWithIntl = injectIntl(PageList)

export default React.memo(PageListWithQuery)
