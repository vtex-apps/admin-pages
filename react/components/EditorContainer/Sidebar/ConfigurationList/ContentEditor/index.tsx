import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { FormProps } from 'react-jsonschema-form'

import ComponentEditor from '../../ComponentEditor'

import ConditionControls from './ConditionControls'
import LabelEditor from './LabelEditor'

interface Props {
  componentTitle?: ComponentSchema['title']
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  contentSchema?: JSONSchema6
  data?: object
  iframeRuntime: RenderContext
  isDefault: boolean
  isLoading: boolean
  isSitewide: boolean
  label?: string
  onClose: () => void
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onFormChange: FormProps<object>['onChange']
  onLabelChange: (event: Event) => void
  onSave: () => void
  shouldDisableSaveButton: boolean
}

const ContentEditor: React.FunctionComponent<Props> = ({
  componentTitle,
  condition,
  contentSchema,
  data = {},
  iframeRuntime,
  isDefault,
  isLoading,
  isSitewide,
  label,
  onClose,
  onConditionChange,
  onFormChange,
  onLabelChange,
  onSave,
  shouldDisableSaveButton,
}) => (
  <ComponentEditor
    after={
      <Fragment>
        <div className="pt5 ph5 bt bw1 b--light-silver">
          <LabelEditor onChange={onLabelChange} value={label || ''} />
        </div>
        {!isDefault ? (
          <ConditionControls
            condition={condition}
            isSitewide={isSitewide}
            pageContext={iframeRuntime.route.pageContext}
            onConditionChange={onConditionChange}
          />
        ) : null}
      </Fragment>
    }
    contentSchema={contentSchema}
    data={data}
    iframeRuntime={iframeRuntime}
    isContent
    isLoading={isLoading}
    onChange={onFormChange}
    onClose={onClose}
    onSave={onSave}
    shouldDisableSaveButton={shouldDisableSaveButton}
    title={componentTitle}
  />
)

export default ContentEditor
