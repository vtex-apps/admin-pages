import React from 'react'
import { Query, QueryResult } from 'react-apollo'
import ListFonts from '../graphql/ListFonts.graphql'
import { FontFile } from '../mutations/SaveFontFamily'

export interface FontFamily {
  id: string
  fontFamily: string
  fonts: FontFile[]
}

export interface ListFontsData {
  listFonts: FontFamily[]
}

export type ListFontsQueryResult = QueryResult<ListFontsData>

class ListFontsQuery extends Query<ListFontsData, {}> {
  public static defaultProps = {
    query: ListFonts,
  }
}

export default ListFontsQuery
