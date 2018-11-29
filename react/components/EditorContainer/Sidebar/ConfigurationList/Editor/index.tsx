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
  newLabel?: string
  onConditionsChange: (newConditions: string[]) => void
  onFormChange: (event: IChangeEvent) => void
  onLabelChange: (event: Event) => void
  onSave: () => void
  onScopeChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    newScope: ConfigurationScope,
  ) => void
  runtime: RenderContext
}

const Editor: React.SFC<Props> = ({
  conditions,
  configuration,
  editor,
  newLabel,
  onConditionsChange,
  onFormChange,
  onLabelChange,
  onSave,
  onScopeChange,
  runtime,
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
    <div className="ph5 mt5">
      <LabelEditor
        onChange={onLabelChange}
        value={
          newLabel !== undefined
            ? newLabel
            : configuration && configuration.label
        }
      />
      <div className="mt5">
        <ConditionsSelector
          editor={editor}
          onCustomConditionsChange={onConditionsChange}
          onScopeChange={onScopeChange}
          runtime={runtime}
          scope={configuration && configuration.scope}
          selectedConditions={conditions}
        />
      </div>
      <ComponentEditor
        editor={editor}
        onChange={onFormChange}
        onSave={onSave}
        props={props}
        runtime={runtime}
      />
    </div>
  )
}

export default Editor
