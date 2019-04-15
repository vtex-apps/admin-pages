import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

import Colors from '../components/Colors'
import { EditMode } from './Editor'

interface Props {
  addNavigation: (info: NavigationInfo) => void
  config: TachyonsConfig
  intl: InjectedIntl
  setMode: (mode: EditMode) => void
}

interface AvailableEditorProps {
  addNavigation: (info: NavigationInfo) => void
  formattedMessage: string
  mode: EditMode
  setMode: (mode: EditMode) => void
  widget: React.ReactNode
}

const Editor: React.FunctionComponent<Props> = ({
  addNavigation,
  config,
  intl,
  setMode,
}) => {
  const {
    semanticColors: {
      background: { emphasis, action_primary },
    },
  } = config


  const colorEditorProps = {
    addNavigation,
    formattedMessage: intl.formatMessage({
      id: 'pages.editor.styles.edit.colors.title',
    }),
    mode: 'colors' as EditMode,
    setMode,
    widget: <Colors colors={[emphasis, action_primary]} />,
  }

  return (
    <div className="ph6">
      <AvailableEditor {...colorEditorProps} />
    </div>
  )
}

const AvailableEditor: React.FunctionComponent<AvailableEditorProps> = ({
  addNavigation,
  formattedMessage,
  mode,
  setMode,
  widget,
}) => {
  const onEditorSelected = () => {
    addNavigation({
      backButton: {
        action: () => setMode(undefined),
        text: formattedMessage,
      },
      title: formattedMessage,
    })
    setMode(mode)
  }

  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={onEditorSelected}
    >
      <span className="f4">{formattedMessage}</span>
      {widget}
    </div>
  )
}

export default injectIntl(Editor)
