import React from 'react'

import { DataProxy } from 'apollo-cache'
import { Mutation, MutationFn, QueryResult } from 'react-apollo'

import DeleteFontFamilyMutation from '../graphql/DeleteFontFamily.graphql'
import ListFonts from '../graphql/ListFonts.graphql'
import { ListFontsData } from '../queries/ListFontsQuery'

interface FontFamilyVariables {
  id: string
}

export interface DeleteFontFamilyData {
  deleteFontFamily: {
    id: string
  }
}

export type DeleteFontFamilyFn = MutationFn<
  DeleteFontFamilyData,
  FontFamilyVariables
>

type DeleteFontFamilyResult = QueryResult<DeleteFontFamilyData>

const updateFontsAfterDelete = (
  cache: DataProxy,
  result: DeleteFontFamilyResult
) => {
  const listData = cache.readQuery<ListFontsData>({ query: ListFonts })
  if (result.data == null || listData == null) {
    return
  }
  const { listFonts: families } = listData
  const { id: removedId } = result.data.deleteFontFamily
  const currentFonts = families.filter(family => family.id !== removedId)
  cache.writeQuery<ListFontsData>({
    data: { listFonts: currentFonts },
    query: ListFonts,
  })
}

class DeleteFontFamily extends Mutation<
  DeleteFontFamilyData,
  FontFamilyVariables
> {
  public static defaultProps = {
    mutation: DeleteFontFamilyMutation,
    update: updateFontsAfterDelete,
  }
}

export default DeleteFontFamily
