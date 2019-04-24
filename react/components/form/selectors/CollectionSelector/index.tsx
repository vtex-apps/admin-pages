import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'

import Selector from '../Selector'

import Collection from './Collection.graphql'
import Collections from './Collections.graphql'

const CollectionSelector: React.FunctionComponent<WidgetProps> = ({
  onChange,
  schema,
  value,
}) => (
  <Selector
    entity="collection"
    initialQuery={Collection}
    initialValue={value}
    onChange={onChange}
    query={Collections}
    schema={schema}
  />
)

export default CollectionSelector
