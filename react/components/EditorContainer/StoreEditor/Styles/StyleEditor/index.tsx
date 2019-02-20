import { mergeDeepRight } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'

import Colors from '../components/Colors'
import ColorsEditor from './ColorsEditor'
import GenerateStyleSheet from './queries/GenerateStyleSheet.graphql'
import UpdateStyle from './queries/UpdateStyle.graphql'

import StyleEditorTools from './StyleEditorTools'

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
  navigation: NavigationInfo[]
}

class StyleEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const {
      stopEditing,
      style: { name, config },
    } = this.props

    this.state = {
      config,
      mode: undefined,
      name,
      navigation: [
        {
          backButton: {
            action: stopEditing,
            text: 'Back',
          },
          title: name,
        },
      ],
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
    const { navigation } = this.state
    const {
      backButton: { text },
      title,
    } = navigation.slice(-1)[0]

    return (
      <StyleEditorTools
        backText={text}
        goBack={this.navigateBack}
        saveStyle={this.saveStyle}
        title={title}
      >
        {this.renderEditor()}
      </StyleEditorTools>
    )
  }

  private renderEditor() {
    const {
      mode,
      config: {
        typography: {
          styles: { heading_6 },
        },
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
            font={heading_6}
            semanticColors={semanticColors}
            updateStyle={this.updateStyle}
            addNavigation={this.addNavigation}
          />
        )
      default:
        return (
          <div className="ph6">
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

  private updateStyle = (partialConfig: Partial<TachyonsConfig>) => {
    const { config } = this.state
    this.setState(
      {
        config: mergeDeepRight(config, partialConfig as TachyonsConfig),
      },
      this.updateStyleTag
    )
  }

  private setEditMode = (mode?: EditMode) => {
    this.setState({
      mode,
    })
    if (mode) {
      this.addNavigation({
        backButton: {
          action: () => this.setEditMode(),
          text: 'Back',
        },
        title: mode,
      })
    }
  }

  private navigateBack = () => {
    const { navigation } = this.state

    const navigationInfo = navigation.splice(-1, 1)
    const {
      backButton: { action },
    } = navigationInfo[0]

    action()

    this.setState({
      navigation,
    })
  }

  private addNavigation = (newNavigation: NavigationInfo) => {
    const { navigation } = this.state

    this.setState({
      navigation: [...navigation, newNavigation],
    })
  }

  private saveStyle = async () => {
    const {
      client,
      style: { id },
    } = this.props
    const { config } = this.state

    interface UpdateStyleQuery {
      id: string
    }

    client.mutate<{ updateStyle: UpdateStyleQuery }>({
      mutation: UpdateStyle,
      variables: {
        config,
        id,
      },
    })
  }
}

export default withApollo(StyleEditor)
