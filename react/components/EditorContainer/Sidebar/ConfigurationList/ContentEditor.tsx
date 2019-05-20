import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FormProps } from 'react-jsonschema-form'

import ComponentEditor from '../ComponentEditor'

interface Props {
  componentTitle?: ComponentSchema['title']
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  contentSchema?: JSONSchema6
  data?: object
  iframeRuntime: RenderContext
  isDefault: boolean
  isSitewide: boolean
  onClose: () => void
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onFormChange: FormProps<{ formData: object }>['onChange']
  onSave: () => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ContentEditor: React.FunctionComponent<Props> = ({
  componentTitle,
  condition,
  contentSchema,
  data = {},
  iframeRuntime,
  isDefault,
  isSitewide,
  onClose,
  onConditionChange,
  onFormChange,
  onSave,
  onTitleChange,
}) => (
  <ComponentEditor
    condition={condition}
    contentSchema={contentSchema}
    data={data}
    iframeRuntime={iframeRuntime}
    isSitewide={isSitewide}
    isDefault={isDefault}
    onConditionChange={onConditionChange}
    onChange={onFormChange}
    onClose={onClose}
    onSave={onSave}
    onTitleChange={onTitleChange}
    title={componentTitle}
  />
)

export default ContentEditor
