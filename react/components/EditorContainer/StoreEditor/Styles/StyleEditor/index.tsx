import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { IconArrowBack } from 'vtex.styleguide'

import Colors from '../components/Colors'
import ColorsEditor from './ColorsEditor'
import GenerateStyleSheet from './queries/GenerateStyleSheet.graphql'

const STYLE_TAG_ID = 'style_edit'

type EditMode = 'colors'

interface CustomProps {
  iframeWindow: Window
  style: Style
  stopEditing: () => void
}

type Props = WithApolloClient<CustomProps>

interface State {
  config: TachyonsConfig
  mode?: EditMode
  name: string
}

class StyleEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const {
      style: { name, config },
    } = this.props

    this.state = {
      config,
      mode: undefined,
      name,
    }
  }

  public componentWillMount() {
    const { iframeWindow, style } = this.props

    const styleLinkElement =
      iframeWindow &&
      iframeWindow.document &&
      iframeWindow.document.getElementById('style_link')
    if (styleLinkElement) {
      styleLinkElement.setAttribute('href', style.path)
    }

    const styleTag = iframeWindow.document.createElement('style')
    styleTag.id = STYLE_TAG_ID
    if (iframeWindow.document.head) {
      iframeWindow.document.head.append(styleTag)
    }

    this.updateStyleTag()
  }

  public componentWillUnmount() {
    const { iframeWindow } = this.props
    const styleTag = iframeWindow.document.getElementById(STYLE_TAG_ID)
    if (styleTag && iframeWindow.document.head) {
      iframeWindow.document.head.removeChild(styleTag)
    }
  }

  public render() {
    const { stopEditing } = this.props
    const {
      mode,
      config: {
        semanticColors,
        semanticColors: {
          background: { emphasis, action_primary },
        },
      },
    } = this.state

    switch (mode) {
      case 'colors':
        return (
          <ColorsEditor
            semanticColors={semanticColors}
            updateColors={this.updateColors}
          />
        )
      default:
        const {
          style: { name },
        } = this.props
        return (
          <div className="flex flex-column ma6">
            <div
              className="pointer flex items-center mv3 c-action-primary"
              onClick={stopEditing}
            >
              <IconArrowBack />
              <span className="ml2 f5">Back</span>
            </div>
            <span className="f3">{name}</span>
            <div
              className="pointer flex justify-between items-center pv6 bb b--muted-4"
              onClick={() => this.setEditMode('colors')}
            >
              <span className="f4">Colors</span>
              <Colors colors={[emphasis, action_primary]} />
            </div>
          </div>
        )
    }
  }

  private async updateStyleTag() {
    const { client, iframeWindow } = this.props
    const { config } = this.state

    const result = await client.query<{ generateStyleSheet: string }>({
      query: GenerateStyleSheet,
      variables: {
        config,
      },
    })
    const stylesheet = result.data.generateStyleSheet

    const styleTag = iframeWindow.document.getElementById(STYLE_TAG_ID)
    if (styleTag) {
      styleTag.innerHTML = stylesheet
    }
  }

  private updateColors = (semanticColors: SemanticColors) => {
    const { config } = this.state
    this.setState(
      {
        config: {
          ...config,
          semanticColors,
        },
      },
      this.updateStyleTag
    )
  }

  private setEditMode(mode?: EditMode) {
    this.setState({
      mode,
    })
  }
}

export default withApollo(StyleEditor)
