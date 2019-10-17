import React, { Component } from 'react'
import { Query, QueryResult, QueryComponentOptions } from 'react-apollo'
import ListContent from '../graphql/ListContent.graphql'

export const ListContentGraphqlDocument = ListContent

export interface ListContentVariables {
  blockId: string
  pageContext: { id: string; type: string }
  template: string
  treePath: string
}

export interface ListContentData {
  listContentWithSchema?: {
    content?: ExtensionConfiguration[]
    schemaJSON: string
  }
}

export type ListContentQueryResult = QueryResult<
  ListContentData,
  ListContentVariables
>

class ListContentQuery extends Component<
  QueryComponentOptions<ListContentData, ListContentVariables>
> {
  public static defaultProps = {
    fetchPolicy: 'network-only',
    query: ListContent,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Query<ListContentData, ListContentVariables> {...rest}>
        {result => children(result)}
      </Query>
    )
  }
}

export default ListContentQuery
