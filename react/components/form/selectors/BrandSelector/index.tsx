import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'

import Selector from '../Selector'

import Brand from './Brand.graphql'
import Brands from './Brands.graphql'

const BrandSelector: React.FunctionComponent<WidgetProps> = ({
  onChange,
  schema,
  value,
}) => (
  <Selector
    entity="brand"
    initialQuery={Brand}
    initialValue={value}
    onChange={onChange}
    query={Brands}
    schema={schema}
  />
)

export default BrandSelector
