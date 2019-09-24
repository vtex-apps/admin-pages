import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import React, { Fragment, useMemo } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
import { Button } from 'vtex.styleguide'

import { useEditorContext } from '../../../../EditorContext'
import EditableText from '../../../EditableText'
import { useFormMetaContext } from '../../FormMetaContext'
import { FormDataContainer } from '../../typings'
import EditorHeader from '../EditorHeader'
import LoaderContainer from '../LoaderContainer'

import ConditionControls from './ConditionControls'
import Form from './Form'
import { useComponentFormStateStack } from './hooks'
import styles from './styles.css'
import { getSchemas } from './utils'

interface CustomProps {
  condition?: ExtensionConfiguration['condition']
  contentSchema?: JSONSchema6
  data: FormDataContainer
  iframeRuntime: RenderContext
  isActive?: boolean
  isNew?: boolean
  isSitewide?: boolean
  label?: string | null
  onChange: FormProps<FormDataContainer>['onChange']
  onClose: () => void
  onConditionChange?: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onLabelChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onListOpen?: () => void
  onSave: () => void
  title: ComponentSchema['title']
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const BlockConfigurationEditor: React.FunctionComponent<Props> = ({
  condition,
  contentSchema,
  data,
  iframeRuntime,
  isActive,
  isNew,
  isSitewide = false,
  label,
  onChange,
  onClose,
  onConditionChange,
  onLabelChange,
  onListOpen,
  onSave,
  title,
}) => {
  const editor = useEditorContext()
  const formMeta = useFormMetaContext()
  const {
    currentDepth,
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

  const isArrayFieldOpen = Boolean(componentFormState)

  const isRootLevel = componentFormState === undefined

  return (
    <Fragment>
      <LoaderContainer
        id="component-editor-container"
        containerClassName="h-100 overflow-y-auto overflow-x-hidden"
      >
        <EditorHeader
          onOpenList={isRootLevel ? onListOpen : undefined}
          onClose={componentFormState ? componentFormState.onClose : onClose}
          title={componentFormState ? componentFormState.title : title}
        />

        <div
          className={classnames(
            'relative bg-white flex flex-column justify-between size-editor w-100 pb3 ph5',
            styles['form'],
            { [styles['form--leave']]: isArrayFieldOpen }
          )}
        >
          <FormattedMessage
            defaultMessage="Untitled content"
            id="admin/pages.editor.configuration.defaultTitle"
          >
            {placeholder => (
              <EditableText
                baseClassName="lh-copy f6 fw5 near-black"
                onChange={onLabelChange}
                placeholder={placeholder as string}
                value={label || ''}
              />
            )}
          </FormattedMessage>

          <Form
            formContext={{
              currentDepth,
              componentFormState,
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

        {isContent &&
          !isActive &&
          condition &&
          onConditionChange &&
          !isArrayFieldOpen && (
            <ConditionControls
              condition={condition}
              isSitewide={isSitewide}
              onConditionChange={onConditionChange}
              pageContext={iframeRuntime.route.pageContext}
            />
          )}
      </LoaderContainer>

      <div
        className={classnames(
          'pr4 pv4 flex-row-reverse w-100 bt bw1 b--light-silver',
          {
            dn: isArrayFieldOpen,
            flex: !isArrayFieldOpen,
          }
        )}
      >
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
    </Fragment>
  )
}

export default injectIntl(BlockConfigurationEditor)
