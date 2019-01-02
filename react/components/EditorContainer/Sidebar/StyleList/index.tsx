import { filter } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'

import ListStyles from '../../../../queries/ListStyles.graphql'

import List from './List'

interface Props {
  iframeWindow: Window
  stylesQueryInfo: any
}

interface State {
  currentStyle: Style | undefined
}

class StyleList extends Component<Props, State> {
  public static getDerivedStateFromProps(props: Props, state: State) {
    const { stylesQueryInfo: {listStyles} } = props

    if (state.currentStyle === undefined) {
      const currentStyle = listStyles && filter((style: Style) => style.selected, listStyles)

      return {
        currentStyle: currentStyle && currentStyle[0]
      }
    }
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      currentStyle: undefined
    }
  }

  public render() {
    const { stylesQueryInfo, stylesQueryInfo: {listStyles} } = this.props
    const { currentStyle } = this.state

    return stylesQueryInfo.loading ? (
      <div className="w100 pt7 flex justify-around">
        <Spinner />
      </div>
    ) : (
      <List styles={listStyles} currentStyle={currentStyle} onChange={this.onChange} />
    )
  }

  private onChange = async (style: Style | undefined) => {
    const { iframeWindow } = this.props

    if (style === undefined) {
      return
    }

    const styleLinkElement = iframeWindow && iframeWindow.document && iframeWindow.document.getElementById('style_link')

    if (styleLinkElement) {
      styleLinkElement.setAttribute('href', style.path)
    }

    this.setState({ currentStyle: style })
  }
}

export default compose(
  graphql(ListStyles, { name: 'stylesQueryInfo' }),
)(StyleList)
