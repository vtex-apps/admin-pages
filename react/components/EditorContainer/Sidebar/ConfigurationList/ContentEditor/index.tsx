import React from 'react'
import { IChangeEvent } from 'react-jsonschema-form'

import { getExtension } from '../../../../../utils/components'
import ComponentEditor from '../../ComponentEditor'

import ConditionControls from './ConditionControls'

interface Props {
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  editor: EditorContext
  iframeRuntime: RenderContext
  isLoading: boolean
  label?: string
  onClose: () => void
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onFormChange: (event: IChangeEvent) => void
  onLabelChange: (event: Event) => void
  onSave: () => void
  shouldDisableSaveButton: boolean
}

const ContentEditor: React.SFC<Props> = ({
  condition,
  configuration,
  editor,
  iframeRuntime,
  isLoading,
  label,
  onClose,
  onConditionChange,
  onFormChange,
  onLabelChange,
  onSave,
  shouldDisableSaveButton,
}) => {
  const extension = getExtension(editor.editTreePath, iframeRuntime.extensions)

  const extensionContent = {
    component: extension.component || null,
    ...extension.content,
  }

  const content = configuration
    ? {
        ...(configuration.contentJSON && JSON.parse(configuration.contentJSON)),
        ...extensionContent,
      }
    : extensionContent

  return (
    <ComponentEditor
      after={
        <ConditionControls
          condition={condition}
          label={label}
          onConditionChange={onConditionChange}
          onLabelChange={onLabelChange}
        />
      }
      data={content}
      editor={editor}
      iframeRuntime={iframeRuntime}
      isContent
      isLoading={isLoading}
      onChange={onFormChange}
      onClose={onClose}
      onSave={onSave}
      shouldDisableSaveButton={shouldDisableSaveButton}
    />
  )
}

export default ContentEditor
