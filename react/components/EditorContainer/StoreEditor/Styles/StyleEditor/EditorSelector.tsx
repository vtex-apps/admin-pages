import React from 'react'
import { FormattedMessage } from 'react-intl'

import Colors from '../components/Colors'
import AvailableEditor from './AvailableEditor'
import StyleEditorHeader from './StyleEditorHeader'
import { EditorPath, IdParam } from './StyleEditorRouter'

interface Props {
  config: TachyonsConfig
  name: string
  onSave: () => void
  stopEditing: () => void
}

const EditorSelector: React.FunctionComponent<Props> = ({
  config,
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
    path: EditorPath.colors.replace(IdParam, ''),
    titleId: 'admin/pages.editor.styles.edit.colors.title',
    widget: <Colors colors={[emphasis, action_primary]} />,
  }
  const typographyEditorProps = {
    path: EditorPath.typography,
    titleId: 'admin/pages.editor.styles.edit.typography.title',
    widget: <div className="t-heading-2">Aa</div>,
  }

  const saveButtonLabel = (
    <FormattedMessage id="admin/pages.editor.components.button.save" />
  )

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
        <AvailableEditor {...typographyEditorProps} />
      </div>
    </>
  )
}

export default EditorSelector
