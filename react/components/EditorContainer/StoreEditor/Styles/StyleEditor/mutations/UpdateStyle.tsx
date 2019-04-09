import React from 'react'
import { Mutation } from 'react-apollo'
import UpdateStyle from '../graphql/UpdateStyle.graphql'

interface UpdateStyleData {
  updateStyle: {
    path: string
    selected: boolean
  }
}

interface UpdateStyleVariables {
  id: string
  config: TachyonsConfig
}

class UpdateStyleMutation extends Mutation<
  UpdateStyleData,
  UpdateStyleVariables
> {
  public static defaultProps = {
    mutation: UpdateStyle,
  }
}

export default UpdateStyleMutation
