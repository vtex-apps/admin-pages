import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'

import Selector from '../Selector'

import Department from './Department.graphql'
import Departments from './Departments.graphql'

const DepartmentSelector: React.FunctionComponent<WidgetProps> = ({
  onChange,
  schema,
  value,
}) => (
  <Selector
    entity="department"
    initialQuery={Department}
    initialValue={value}
    onChange={onChange}
    query={Departments}
    schema={schema}
  />
)

export default DepartmentSelector
