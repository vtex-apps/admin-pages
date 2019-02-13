import React, { Component } from 'react'

import StyleEditor from './StyleEditor'
import StyleList from './StyleList'

interface Props {
  iframeWindow: Window
}

interface State {
  editing?: Style
}

export default class Styles extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      editing: undefined,
    }
  }

  public render() {
    const { iframeWindow } = this.props
    const { editing } = this.state
    return editing ? (
      <StyleEditor style={editing} stopEditing={() => this.startEditing()} />
    ) : (
      <StyleList iframeWindow={iframeWindow} startEditing={this.startEditing} />
    )
  }

  private startEditing = (style?: Style) => {
    this.setState({
      editing: style,
    })
  }
}
