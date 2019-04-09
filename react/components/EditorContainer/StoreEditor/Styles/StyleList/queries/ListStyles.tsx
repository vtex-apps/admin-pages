import React from 'react'
import { Query, QueryResult } from 'react-apollo'
import ListStyles from '../graphql/ListStyles.graphql'

export interface ListStylesData {
  listStyles: Style[]
}

export type ListStylesQueryResult = QueryResult<ListStylesData>

class ListStylesQuery extends Query<ListStylesData, {}> {
  public static defaultProps = {
    query: ListStyles,
  }
}

export default ListStylesQuery
