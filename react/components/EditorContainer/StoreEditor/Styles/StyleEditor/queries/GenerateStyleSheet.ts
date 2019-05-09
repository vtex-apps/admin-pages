import { Query } from 'react-apollo'
import GenerateStyleSheet from '../graphql/GenerateStyleSheet.graphql'

interface GenerateStyleSheetData {
  generateStyleSheet: string
}

interface GenerateStyleSheetVariables {
  config: TachyonsConfig
}

class GenerateStyleSheetQuery extends Query<
  GenerateStyleSheetData,
  GenerateStyleSheetVariables
> {
  public static defaultProps = {
    query: GenerateStyleSheet,
  }
}

export default GenerateStyleSheetQuery
