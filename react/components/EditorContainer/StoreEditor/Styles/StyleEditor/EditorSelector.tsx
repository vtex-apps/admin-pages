import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

import Colors from '../components/Colors'
import AvailableEditor from './AvailableEditor'
import StyleEditorHeader from './StyleEditorHeader'
import { ColorsIdParam, EditorPath } from './StyleEditorRouter'

interface Props {
  config: TachyonsConfig
  name: string
  onSave: () => void
  stopEditing: () => void
  intl: InjectedIntl
}

const EditorSelector: React.FunctionComponent<Props> = ({
  config,
  intl,
  name,
  onSave,
  stopEditing,
}) => {
  const {
    semanticColors: {
      background: { emphasis, action_primary },
    },
  } = config

  const colorEditorProps = {
    path: EditorPath.colors.replace(ColorsIdParam, ''),
    titleId: 'pages.editor.styles.edit.colors.title',
    widget: <Colors colors={[emphasis, action_primary]} />,
  }

  const saveButtonLabel = intl.formatMessage({
    id: 'pages.editor.components.button.save',
  })

  return (
    <>
      <StyleEditorHeader
        onAux={onSave}
        auxButtonLabel={saveButtonLabel}
        afterOnBack={stopEditing}
        title={name}
      />
      <div className="ph6">
        <AvailableEditor {...colorEditorProps} />
      </div>
    </>
  )
}

export default injectIntl(EditorSelector)
