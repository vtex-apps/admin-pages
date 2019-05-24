import { JSONSchema6 } from 'json-schema'
import React, { Fragment, useMemo } from 'react'
import { injectIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'

import { useEditorContext } from '../../../EditorContext'
import EditorHeader from '../EditorHeader'

import ConditionControls from './ConditionControls'
import Form from './Form'
import LabelEditor from './LabelEditor'
import { getSchemas } from './utils'

interface CustomProps {
  condition?: ExtensionConfiguration['condition']
  contentSchema?: JSONSchema6
  data: object
  iframeRuntime: RenderContext
  isDefault?: boolean
  isSitewide?: boolean
  label?: string
  onChange: FormProps<{ formData: object }>['onChange']
  onClose: () => void
  onConditionChange?: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onLabelChange?: (event: Event) => void
  onSave: () => void
  title?: ComponentSchema['title']
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const ComponentEditor: React.FunctionComponent<Props> = ({
  condition,
  contentSchema,
  data,
  iframeRuntime,
  isDefault,
  isSitewide = false,
  label,
  onChange,
  onConditionChange,
  onClose,
  onLabelChange,
  onSave,
  title,
}) => {
  const editor = useEditorContext()

  const isContent = useMemo(() => editor.mode === 'content', [editor.mode])

  const { componentSchema, uiSchema } = useMemo(
    () =>
      getSchemas({
        contentSchema,
        editTreePath: editor.editTreePath,
        iframeRuntime,
        isContent,
      }),
    [editor.editTreePath, editor.mode]
  )

  const schema = useMemo(
    () => ({
      ...componentSchema,
      properties: {
        ...componentSchema.properties,
      },
      title: undefined,
    }),
    [componentSchema]
  )

  return (
    <Fragment>
      <EditorHeader onClose={onClose} title={title || componentSchema.title} />

      <div className="h-100 overflow-y-auto overflow-x-hidden">
        <div className="relative bg-white flex flex-column justify-between size-editor w-100 pb3 ph5">
          <Form
            formContext={{
              addMessages: iframeRuntime.addMessages,
              isLayoutMode: editor.mode === 'layout',
              messages: iframeRuntime.messages,
            }}
            formData={data}
            onChange={onChange}
            onSubmit={onSave}
            schema={schema as JSONSchema6}
            uiSchema={uiSchema}
          />

          <div id="form__error-list-template___alert" />
        </div>

        {isContent && (
          <div className="flex flex-column justify-between">
            {onLabelChange && (
              <div className="pa5 bt bw1 b--light-silver">
                <LabelEditor onChange={onLabelChange} value={label || ''} />
              </div>
            )}

            {!isDefault && condition && onConditionChange && (
              <ConditionControls
                condition={condition}
                isSitewide={isSitewide}
                onConditionChange={onConditionChange}
                pageContext={iframeRuntime.route.pageContext}
              />
            )}
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default injectIntl(ComponentEditor)
