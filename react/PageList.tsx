import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Query } from 'react-apollo'

import Section from './components/admin/Pages/List/Section'
import SectionSeparator from './components/admin/Pages/List/SectionSeparator'
import { CategorizedRoutes } from './components/admin/Pages/List/typings'
import Styles from './components/admin/Styles'
import Loader from './components/Loader'
import RoutesQuery from './queries/Routes.graphql'

const sortRoutes = (routes: Route[]) =>
  routes.sort((a, b) => a.id.localeCompare(b.id))

const PageList = (_: {}, context: AdminContext) => (
  <Styles>
    <Query query={RoutesQuery}>
      {({ data: { routes }, loading: isLoading }) => {
        if (isLoading) {
          context.startLoading()

          return <Loader />
        }

        context.stopLoading()

        const storeRoutes = routes.filter((route: Route) =>
          /^store\/[A-Za-z:]+$/.test(route.id),
        )

        const categorizedRoutes = storeRoutes.reduce(
          (acc: CategorizedRoutes, currRoute: Route) => {
            const currRouteContext = currRoute.context || ''

            if (currRouteContext.endsWith('ProductSearchContextProvider')) {
              return {
                ...acc,
                multipleProducts: [...acc.multipleProducts, currRoute],
              }
            }

            if (currRouteContext.endsWith('ProductContextProvider')) {
              return { ...acc, singleProduct: [...acc.singleProduct, currRoute] }
            }

            return { ...acc, noProducts: [...acc.noProducts, currRoute] }
          },
          {
            multipleProducts: [],
            noProducts: [],
            singleProduct: [],
          },
        )

        return (
          <Fragment>
            <Section
              hasCreateButton
              routes={sortRoutes(categorizedRoutes.noProducts)}
              titleId="pages.admin.pages.list.section.standard"
            />
            <SectionSeparator />
            <Section
              routes={sortRoutes(categorizedRoutes.singleProduct)}
              titleId="pages.admin.pages.list.section.product"
            />
            <SectionSeparator />
            <Section
              routes={sortRoutes(categorizedRoutes.multipleProducts)}
              titleId="pages.admin.pages.list.section.productCollections"
            />
          </Fragment>
        )
      }}
    </Query>
  </Styles>
)

PageList.contextTypes = {
  startLoading: PropTypes.func.isRequired,
  stopLoading: PropTypes.func.isRequired,
}

export default PageList
