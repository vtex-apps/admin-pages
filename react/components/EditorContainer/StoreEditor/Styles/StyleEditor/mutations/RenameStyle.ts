import { Mutation } from 'react-apollo'
import RenameStyle from '../graphql/RenameStyle.graphql'

interface RenameStyleData {
  renameStyle: {
    id: string
  }
}

interface RenameStyleVariables {
  id: string
  name: string
}

class RenameStyleMutation extends Mutation<
  RenameStyleData,
  RenameStyleVariables
> {
  public static defaultProps = {
    mutation: RenameStyle,
  }
}

export default RenameStyleMutation
