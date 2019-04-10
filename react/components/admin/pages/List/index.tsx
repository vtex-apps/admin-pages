import React, { Fragment } from 'react'

import Section from './Section'
import SectionSeparator from './SectionSeparator'
import { CategorizedRoutes } from './typings'
import { sortRoutes } from './utils'

interface Props {
  categorizedRoutes: CategorizedRoutes
}

const List: React.FunctionComponent<Props> = ({ categorizedRoutes }) => (
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

export default List
