import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'

import Selector from '../Selector'

import Categories from './Categories.graphql'
import Category from './Category.graphql'

const CategorySelector: React.FunctionComponent<WidgetProps> = ({
  onChange,
  schema,
  value,
}) => (
  <Selector
    entity="category"
    onChange={onChange}
    initialQuery={Category}
    initialValue={value}
    query={Categories}
    schema={schema}
  />
)

export default CategorySelector
