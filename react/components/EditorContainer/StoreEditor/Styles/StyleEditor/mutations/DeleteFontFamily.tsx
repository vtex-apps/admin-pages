import { DataProxy } from 'apollo-cache'
import { Mutation, MutationFunction, QueryResult, MutationComponentOptions } from 'react-apollo'

import DeleteFontFamilyMutation from '../graphql/DeleteFontFamily.graphql'
import ListFonts from '../graphql/ListFonts.graphql'
import { ListFontsData } from '../queries/ListFontsQuery'
import { Component } from 'react'

interface FontFamilyVariables {
  id: string
}

export interface DeleteFontFamilyData {
  deleteFontFamily: {
    id: string
  }
}

export type DeleteFontFamilyFn = MutationFunction<
  DeleteFontFamilyData,
  FontFamilyVariables
>

type DeleteFontFamilyResult = QueryResult<DeleteFontFamilyData>

const updateFontsAfterDelete = (
  cache: DataProxy,
  result: DeleteFontFamilyResult
) => {
  const listData = cache.readQuery<ListFontsData>({ query: ListFonts })
  if (
    result.data == null ||
    result.data.deleteFontFamily == null ||
    listData == null
  ) {
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

class DeleteFontFamily extends Component<MutationComponentOptions<DeleteFontFamilyData, FontFamilyVariables>> {
  public static defaultProps = {
    mutation: DeleteFontFamilyMutation,
    update: updateFontsAfterDelete,
  }
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<DeleteFontFamilyData, FontFamilyVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export default DeleteFontFamily
