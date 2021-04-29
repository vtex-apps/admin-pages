import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import React, { useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
// The styleguide is not exporting the warning icon
import {
  Button,
  ToastConsumerFunctions,
  Toggle,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  IconWarning,
} from 'vtex.styleguide'

import { useEditorContext } from '../../../../EditorContext'
import EditableText from '../../../EditableText'
import { useFormMetaContext } from '../../FormMetaContext'
import { EditingState, FormDataContainer } from '../../typings'
import { isUnidentifiedPageContext } from '../../utils'
import EditorHeader from '../EditorHeader'
import { getIsDefaultContent } from '../utils'
import ConditionControls from './ConditionControls'
import Form from './Form'
import { useComponentFormStateStack } from './hooks'
import styles from './styles.css'
import { getSchemas } from './utils'

export enum ConfigurationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
}

interface Props {
  status?: string
  condition?: ExtensionConfiguration['condition']
  contentSchema?: JSONSchema6
  data: FormDataContainer
  editingContentId: EditingState['contentId']
  iframeRuntime: RenderContext
  isNew?: boolean
  isSitewide?: boolean
  label?: string | null
  onBack: () => void
  onChange: FormProps<FormDataContainer>['onChange']
  onStatusChange: () => void
  onConditionChange?: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onLabelChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onListClose?: () => void
  onListOpen?: () => void
  onSave: () => void
  showToast: ToastConsumerFunctions['showToast']
  title: ComponentSchema['title']
  extensionStatus: ConfigurationStatus
}

const messages = defineMessages({
  pageContextError: {
    defaultMessage:
      'Could not identify {entity}. The configuration will be set to "{template}".',
    id: 'admin/pages.editor.components.condition.toast.error.page-context',
  },
  activationToggleChecked: {
    id: 'admin/pages.editor.components.status.activationToggle.checked',
  },
  activationToggleUnchecked: {
    id: 'admin/pages.editor.components.status.activationToggle.unchecked',
  },
})

const BlockConfigurationEditor: React.FunctionComponent<Props> = ({
  status,
  condition,
  contentSchema,
  data,
  editingContentId,
  iframeRuntime,
  isNew,
  isSitewide = false,
  label,
  onBack,
  onChange,
  onStatusChange,
  onConditionChange,
  onLabelChange,
  onListOpen,
  onSave,
  showToast,
  title,
  extensionStatus,
}) => {
  const intl = useIntl()
  const toggleStatus = status ?? extensionStatus
  const toggleChecked = toggleStatus === ConfigurationStatus.ACTIVE

  React.useEffect(() => {
    const { pageContext } = iframeRuntime.route

    if (isUnidentifiedPageContext(pageContext)) {
      showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage(
          {
            id: messages.pageContextError.id,
          },
          {
            entity: intl.formatMessage({
              id: `admin/pages.editor.components.condition.scope.entity.${
                pageContext.type.startsWith('$') ? 'custom' : pageContext.type
              }`,
            }),
            template: intl.formatMessage({
              id: 'admin/pages.editor.components.condition.scope.template',
            }),
          }
        ),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const isDefaultContent = React.useMemo(() => {
    if (!editor.blockData || !editor.blockData.configurations) {
      return false
    }

    const defaultContent = editor.blockData.configurations.find(
      getIsDefaultContent
    )

    return defaultContent && defaultContent.contentId === editingContentId
  }, [editor.blockData, editingContentId])

  const getStatusWarning = () => {
    if (extensionStatus === ConfigurationStatus.ACTIVE) {
      return 'You can only activate content. Choose the one you want to be active and all others will be deactivated.'
    } else if (condition?.statements.length) {
      return 'This content will activate automatically on the start date you selected. '
    } else if (toggleChecked) {
      return 'If you create this content as active, you will see it in the preview now. Other content will be deactivated.'
    }

    return "If you create this content as inactive, you won't see it in the preview. You will see the currently active content."
  }

  return (
    <div className="w-100 h-100 absolute flex flex-column">
      <div
        className="flex-grow-1 overflow-y-auto overflow-x-hidden"
        id="component-editor-container"
      >
        <EditorHeader
          onBack={componentFormState ? componentFormState.onClose : onBack}
          onListOpen={onListOpen && isRootLevel ? onListOpen : undefined}
          title={componentFormState ? componentFormState.title : title}
        />

        <div
          className={classnames(
            'relative bg-white flex flex-column justify-between w-100 pb3 ph5',
            styles['size-editor'],
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
                baseClassName="lh-copy f5 fw5 near-black"
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
          !isDefaultContent &&
          condition &&
          onConditionChange &&
          !isArrayFieldOpen && (
            <ConditionControls
              condition={condition}
              isSitewide={isSitewide}
              onConditionChange={onConditionChange}
              pageContext={iframeRuntime.route.pageContext}
              extensionStatus={extensionStatus}
            />
          )}

        {isContent && !isDefaultContent && (
          <div className="mt9 ph5">
            <>
              <div className="f4">
                <FormattedMessage id="admin/pages.editor.components.status.title"></FormattedMessage>
              </div>

              <div className="mv5">
                <div className="dib mb6">
                  <IconWarning />
                  <span className="ml3">{getStatusWarning()}</span>
                </div>

                <Toggle
                  label={
                    toggleChecked ? (
                      <FormattedMessage id="admin/pages.editor.components.status.activationToggle.checked"></FormattedMessage>
                    ) : (
                      <FormattedMessage id="admin/pages.editor.components.status.activationToggle.unchecked"></FormattedMessage>
                    )
                  }
                  semantic
                  disabled={
                    extensionStatus === ConfigurationStatus.ACTIVE ||
                    condition?.statements.length
                  }
                  checked={toggleChecked}
                  onChange={() => onStatusChange()}
                />
              </div>
            </>
          </div>
        )}
      </div>

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
            onClick={onBack}
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
    </div>
  )
}

export default BlockConfigurationEditor
