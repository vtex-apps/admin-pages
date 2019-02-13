import React, { Component } from 'react'

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
    return editing ? null : <StyleList iframeWindow={iframeWindow} />
  }
}
