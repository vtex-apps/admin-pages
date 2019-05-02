import { Query, QueryResult } from 'react-apollo'
import ListContent from '../graphql/ListContent.graphql'

export const ListContentGraphqlDocument = ListContent

export interface ListContentVariables {
  blockId: string
  pageContext: { id: string; type: string }
  template: string
  treePath: string
}

export interface ListContentData {
  listContent?: {
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
    query: ListContent,
  }
}

export default ListContentQuery
