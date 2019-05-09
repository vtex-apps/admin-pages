import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { IChangeEvent } from 'react-jsonschema-form'

import { getExtension } from '../../../../../utils/components'
import { useEditorContext } from '../../../../EditorContext'
import ComponentEditor from '../../ComponentEditor'

import ConditionControls from './ConditionControls'
import LabelEditor from './LabelEditor'

interface Props {
  componentTitle?: ComponentSchema['title']
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  contentSchema?: JSONSchema6
  iframeRuntime: RenderContext
  isLoading: boolean
  isSitewide: boolean
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

const ContentEditor: React.FunctionComponent<Props> = ({
  componentTitle,
  condition,
  configuration,
  contentSchema,
  iframeRuntime,
  isSitewide,
  isLoading,
  label,
  onClose,
  onConditionChange,
  onFormChange,
  onLabelChange,
  onSave,
  shouldDisableSaveButton,
}) => {
  const { editTreePath } = useEditorContext()

  const extension = getExtension(editTreePath, iframeRuntime.extensions)

  const content = configuration
    ? {
        ...(configuration.contentJSON && JSON.parse(configuration.contentJSON)),
        ...extension.content,
      }
    : extension.content

  const isDefault = !!(configuration && configuration.origin)

  return (
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
      data={content}
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
}

export default ContentEditor
