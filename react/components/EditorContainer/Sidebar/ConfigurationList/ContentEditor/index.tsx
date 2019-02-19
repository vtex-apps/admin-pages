import React from 'react'
import { IChangeEvent } from 'react-jsonschema-form'

import { getExtension } from '../../../../../utils/components'
import ComponentEditor from '../../ComponentEditor'

import ConditionsSelector from './ConditionsSelector'
import LabelEditor from './LabelEditor'

interface Props {
  conditions: string[]
  configuration?: AdaptedExtensionConfiguration
  editor: EditorContext
  iframeRuntime: RenderContext
  isLoading: boolean
  newLabel?: string
  onClose: () => void
  onConditionsChange: (newConditions: string[]) => void
  onFormChange: (event: IChangeEvent) => void
  onLabelChange: (event: Event) => void
  onSave: () => void
  onScopeChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    newScope: ConfigurationScope
  ) => void
  shouldDisableSaveButton: boolean
}

const ContentEditor: React.SFC<Props> = ({
  conditions,
  configuration,
  editor,
  iframeRuntime,
  isLoading,
  newLabel,
  onClose,
  onConditionsChange,
  onFormChange,
  onLabelChange,
  onSave,
  onScopeChange,
  shouldDisableSaveButton
}) => {
  const extension = getExtension(editor.editTreePath, iframeRuntime.extensions)

  const extensionProps = {
    component: extension.component || null,
    ...extension.props
  }

  const props = configuration
    ? {
        ...(configuration.propsJSON && JSON.parse(configuration.propsJSON)),
        ...extensionProps
      }
    : extensionProps

  return (
    <ComponentEditor
      editor={editor}
      iframeRuntime={iframeRuntime}
      isLoading={isLoading}
      onChange={onFormChange}
      onClose={onClose}
      onSave={onSave}
      props={props}
      shouldDisableSaveButton={shouldDisableSaveButton}
    >
      <div className="mt5">
        <LabelEditor
          onChange={onLabelChange}
          value={
            newLabel !== undefined
              ? newLabel
              : configuration && configuration.label
          }
        />
      </div>
      <div className="mt5 pb5 bb bw1 b--light-silver">
        <ConditionsSelector
          editor={editor}
          iframeRuntime={iframeRuntime}
          onCustomConditionsChange={onConditionsChange}
          onScopeChange={onScopeChange}
          scope={configuration && configuration.scope}
          selectedConditions={conditions}
        />
      </div>
    </ComponentEditor>
  )
}

export default ContentEditor
