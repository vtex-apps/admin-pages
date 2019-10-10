import { Query, QueryResult, QueryComponentOptions } from 'react-apollo'
import ListStyles from '../graphql/ListStyles.graphql'
import { Component } from 'react'

export interface ListStylesData {
  listStyles: Style[]
}

export type ListStylesQueryResult = QueryResult<ListStylesData>

class ListStylesQuery extends Component<QueryComponentOptions<ListStylesData, {}>> {
  public static defaultProps = {
    query: ListStyles,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Query<ListStylesData, {}> {...rest}>
        {(result) => children(result)}
      </Query>
    )
  }
}

export default ListStylesQuery
