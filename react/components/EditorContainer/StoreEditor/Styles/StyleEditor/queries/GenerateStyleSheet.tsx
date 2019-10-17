import React, { Component } from 'react'
import { Query, QueryComponentOptions } from 'react-apollo'
import GenerateStyleSheet from '../graphql/GenerateStyleSheet.graphql'

export interface GenerateStyleSheetData {
  generateStyleSheet: string
}

interface GenerateStyleSheetVariables {
  config: TachyonsConfig
}

class GenerateStyleSheetQuery extends Component<
  QueryComponentOptions<GenerateStyleSheetData, GenerateStyleSheetVariables>
> {
  public static defaultProps = {
    query: GenerateStyleSheet,
  }
  public render() {
    const { children, ...rest } = this.props
    return (
      <Query<GenerateStyleSheetData, GenerateStyleSheetVariables> {...rest}>
        {result => children(result)}
      </Query>
    )
  }
}

export default GenerateStyleSheetQuery
