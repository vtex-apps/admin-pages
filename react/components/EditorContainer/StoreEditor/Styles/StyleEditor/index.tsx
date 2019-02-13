import React, { Component } from 'react'
import { IconArrowBack } from 'vtex.styleguide'

import Colors from '../components/Colors'

type EditMode = 'colors'

interface Props {
  style: Style
  stopEditing: () => void
}

interface State {
  config: TachyonsConfig
  mode?: EditMode
}

class StyleEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const {
      style: { config },
    } = this.props

    this.state = {
      config,
      mode: undefined,
    }
  }

  public render() {
    const { stopEditing } = this.props
    const {
      mode,
      config: {
        semanticColors: {
          background: { emphasis, action_primary },
        },
      },
    } = this.state

    switch (mode) {
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

  private setEditMode(mode?: EditMode) {
    this.setState({
      mode,
    })
  }
}

export default StyleEditor
