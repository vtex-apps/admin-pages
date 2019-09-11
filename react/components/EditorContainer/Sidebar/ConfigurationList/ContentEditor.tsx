import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { FormProps } from 'react-jsonschema-form'

import ComponentEditor from '../ComponentEditor'
import { FormDataContainer } from '../typings'

interface Props {
  componentTitle?: ComponentSchema['title']
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  contentSchema?: JSONSchema6
  data?: FormDataContainer
  iframeRuntime: RenderContext
  isDefault: boolean
  isNew?: boolean
  isSitewide: boolean
  onClose: () => void
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onFormChange: FormProps<FormDataContainer>['onChange']
  onSave: () => void
}

const ContentEditor: React.FunctionComponent<Props> = ({
  componentTitle,
  condition,
  contentSchema,
  data = { formData: {} },
  iframeRuntime,
  isDefault,
  isNew,
  isSitewide,
  onClose,
  onConditionChange,
  onFormChange,
  onSave,
}) => (
  <ComponentEditor
    condition={condition}
    contentSchema={contentSchema}
    data={data}
    iframeRuntime={iframeRuntime}
    isDefault={isDefault}
    isNew={isNew}
    isSitewide={isSitewide}
    onConditionChange={onConditionChange}
    onChange={onFormChange}
    onClose={onClose}
    onSave={onSave}
    title={componentTitle}
  />
)

export default ContentEditor
