import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import SaveSelectedStyle from '../graphql/SaveSelectedStyle.graphql'

interface SaveSelectedStyleData {
  saveSelectedStyle: {
    id: string
    app: string
    name: string
  }
}

interface SaveSelectedStyleVariables {
  id: string
}

export type SaveSelectedStyleMutationFn = MutationFn<
  SaveSelectedStyleData,
  SaveSelectedStyleVariables
>

class SaveSelectedStyleMutation extends Mutation<
  SaveSelectedStyleData,
  SaveSelectedStyleVariables
> {
  public static defaultProps = {
    mutation: SaveSelectedStyle,
  }
}

export default SaveSelectedStyleMutation
