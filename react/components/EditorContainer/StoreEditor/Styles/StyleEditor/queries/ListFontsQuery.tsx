import { Query, QueryResult, QueryComponentOptions } from 'react-apollo'
import ListFonts from '../graphql/ListFonts.graphql'
import { FontFile } from '../mutations/SaveFontFamily'
import { Component } from 'react'

export interface FontFamily {
  id: string
  fontFamily: string
  fonts: FontFile[]
}

export interface ListFontsData {
  listFonts: FontFamily[]
}

export type ListFontsQueryResult = QueryResult<ListFontsData>

class ListFontsQuery extends Component<QueryComponentOptions<ListFontsData, {}>> {
  public static defaultProps = {
    query: ListFonts,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Query<ListFontsData, {}> {...rest}>
        {(result) => children(result)}
      </Query>
    )
  }
}


export default ListFontsQuery
