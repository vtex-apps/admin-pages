import { Query, QueryResult } from 'react-apollo'
import ListContent from '../graphql/ListContent.graphql'

export const ListContentGraphqlDocument = ListContent

export interface ListContentVariables {
  bindingId?: string
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

class ListContentQuery extends Query<ListContentData, ListContentVariables> {
  public static defaultProps = {
    fetchPolicy: 'network-only',
    query: ListContent,
  }
}

export default ListContentQuery
