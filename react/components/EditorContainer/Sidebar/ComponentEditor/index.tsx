import { JSONSchema6 } from 'json-schema'
import React, { Fragment, useMemo, useRef, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { Button } from 'vtex.styleguide'

import { useEditorContext } from '../../../EditorContext'
import ContentContainer from '../ContentContainer'
import EditorHeader from '../EditorHeader'
import { useFormMetaContext } from '../FormMetaContext'
import { FormDataContainer } from '../typings'

import ConditionControls from './ConditionControls'
import Form from './Form'
import { getSchemas } from './utils'

interface CustomProps {
  condition?: ExtensionConfiguration['condition']
  contentSchema?: JSONSchema6
  data: FormDataContainer
  iframeRuntime: RenderContext
  isDefault?: boolean
  isNew?: boolean
  isSitewide?: boolean
  onChange: FormProps<FormDataContainer>['onChange']
  onClose: () => void
  onConditionChange?: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onSave: () => void
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  title?: ComponentSchema['title']
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface ComponentFormState {
  onClose: () => void
  onTitleChange?: () => void
  title: string
}

function useComponentFormStateStack() {
  const [componentFormState, setComponentFormState] = useState<
    ComponentFormState | undefined
  >()
  const stack = useRef<ComponentFormState[]>([])

  function popComponentFormState() {
    stack.current = stack.current.slice(0, stack.current.length - 1)
    setComponentFormState(stack.current[stack.current.length - 1])
  }

  function pushComponentFormState(state: ComponentFormState) {
    stack.current.push(state)
    setComponentFormState(state)
  }

  return {
    componentFormState,
    popComponentFormState,
    pushComponentFormState,
  }
}

const ComponentEditor: React.FunctionComponent<Props> = ({
  condition,
  contentSchema,
  data,
  iframeRuntime,
  isDefault,
  isNew,
  isSitewide = false,
  onChange,
  onConditionChange,
  onClose,
  onSave,
  onTitleChange,
  title,
}) => {
  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const {
    componentFormState,
    popComponentFormState,
    pushComponentFormState,
  } = useComponentFormStateStack()

  const isContent = useMemo(() => editor.mode === 'content', [editor.mode])

  const { componentSchema, uiSchema } = useMemo(
    () =>
      getSchemas({
        contentSchema,
        editTreePath: editor.editTreePath,
        iframeRuntime,
        isContent,
      }),
    [contentSchema, editor.editTreePath, iframeRuntime, isContent]
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

  const isLoading = editor.getIsLoading()

  const shouldDisableSaveButton =
    isLoading || (!formMeta.getWasModified() && !isNew)

  const headerOnTitleChange = componentFormState
    ? componentFormState.onTitleChange
    : onTitleChange

  return (
    <Fragment>
      <ContentContainer
        id="component-editor-container"
        containerClassName="h-100 overflow-y-auto overflow-x-hidden"
      >
        <EditorHeader
          isTitleEditable={headerOnTitleChange && isContent}
          onClose={componentFormState ? componentFormState.onClose : onClose}
          onTitleChange={headerOnTitleChange}
          title={componentFormState ? componentFormState.title : title}
        />

        <div className="relative bg-white flex flex-column justify-between size-editor w-100 pb3 ph5">
          <Form
            formContext={{
              addMessages: iframeRuntime.addMessages,
              isLayoutMode: editor.mode === 'layout',
              messages: iframeRuntime.messages,
              popComponentFormState,
              pushComponentFormState,
            }}
            formData={data}
            onChange={onChange}
            onSubmit={onSave}
            schema={schema as JSONSchema6}
            uiSchema={uiSchema}
          />

          <div id="form__error-list-template___alert" />
        </div>

        {isContent && !isDefault && condition && onConditionChange && (
          <ConditionControls
            condition={condition}
            isSitewide={isSitewide}
            onConditionChange={onConditionChange}
            pageContext={iframeRuntime.route.pageContext}
          />
        )}
      </ContentContainer>

      {!componentFormState && (
        <div className="pr4 pv4 flex flex-row-reverse w-100 bt bw1 b--light-silver">
          <Button
            disabled={shouldDisableSaveButton}
            onClick={onSave}
            size="small"
            variation="primary"
          >
            <FormattedMessage
              defaultMessage="Save"
              id="admin/pages.editor.components.button.save"
            />
          </Button>

          <div className="mr5">
            <Button
              disabled={isLoading}
              onClick={onClose}
              size="small"
              variation="tertiary"
            >
              <FormattedMessage
                defaultMessage="Cancel"
                id="admin/pages.editor.components.button.cancel"
              />
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default injectIntl(ComponentEditor)
