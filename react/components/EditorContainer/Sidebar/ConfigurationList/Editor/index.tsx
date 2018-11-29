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
  isLoading: boolean
  newLabel?: string
  onClose: () => void
  onConditionsChange: (newConditions: string[]) => void
  onFormChange: (event: IChangeEvent) => void
  onLabelChange: (event: Event) => void
  onSave: () => void
  onScopeChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    newScope: ConfigurationScope,
  ) => void
  runtime: RenderContext
  shouldRenderSaveButton: boolean
}

const Editor: React.SFC<Props> = ({
  conditions,
  configuration,
  editor,
  isLoading,
  newLabel,
  onClose,
  onConditionsChange,
  onFormChange,
  onLabelChange,
  onSave,
  onScopeChange,
  runtime,
  shouldRenderSaveButton,
}) => {
  const extension = getExtension(editor.editTreePath, runtime.extensions)

  const extensionProps = {
    component: extension.component || null,
    ...extension.props,
  }

  const props = configuration
    ? {
        ...(configuration.propsJSON && JSON.parse(configuration.propsJSON)),
        ...extensionProps,
      }
    : extensionProps

  return (
    <ComponentEditor
      editor={editor}
      isLoading={isLoading}
      onChange={onFormChange}
      onClose={onClose}
      onSave={onSave}
      props={props}
      runtime={runtime}
      shouldRenderSaveButton={shouldRenderSaveButton}
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
          onCustomConditionsChange={onConditionsChange}
          onScopeChange={onScopeChange}
          runtime={runtime}
          scope={configuration && configuration.scope}
          selectedConditions={conditions}
        />
      </div>
    </ComponentEditor>
  )
}

export default Editor
