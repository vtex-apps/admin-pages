import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import React, { useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
// The styleguide is not exporting the warning icon
import {
  Button,
  ToastConsumerFunctions,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  IconWarning,
  Checkbox,
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
  state?: EditingState
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
  statusFromRuntime: ConfigurationStatus
}

const messages = defineMessages({
  pageContextError: {
    defaultMessage:
      'Could not identify {entity}. The configuration will be set to "{template}".',
    id: 'admin/pages.editor.components.condition.toast.error.page-context',
  },
  activationLabel: {
    id: 'admin/pages.editor.components.condition.visibility.activationLabel',
  },
})

const BlockConfigurationEditor: React.FunctionComponent<Props> = ({
  state,
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
  statusFromRuntime,
}) => {
  const intl = useIntl()

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

  const status = state?.status ?? statusFromRuntime

  const hasEndDate = state?.condition?.statements?.some(
    statement => statement.verb === 'to'
  )

  const getStatusWarningText = () => {
    if (statusFromRuntime === ConfigurationStatus.ACTIVE) {
      return 'You can only activate content. Choose the one you want to be active and all others will be deactivated.'
    } else if (state?.status === ConfigurationStatus.ACTIVE) {
      return 'The current active content will be deactivated.'
    }

    return
  }

  const statusWarningText = getStatusWarningText()

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

        <div className="ma4 mb5">
          {!isNew && statusFromRuntime !== ConfigurationStatus.ACTIVE && (
            <p className="pt4 pb4 pl4 pr2 bg-warning--faded lh-copy">
              <FormattedMessage
                id="admin/pages.editor.components.status.alert"
                defaultMessage="This version of the content is not being shown in the preview and to visitors."
              />
            </p>
          )}
        </div>

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

        {isContent && !isDefaultContent && (
          <>
            <FormattedMessage id="admin/pages.editor.components.condition.title">
              {message => (
                <div className="mb5 ph5 pt7 bt bw1 b--light-silver flex items-center f4">
                  {message}
                </div>
              )}
            </FormattedMessage>

            <div className="ph5 pt5 mb6">
              <>
                <Checkbox
                  checked={status === ConfigurationStatus.ACTIVE || hasEndDate}
                  id="status"
                  label={intl.formatMessage(messages.activationLabel)}
                  disabled={
                    statusFromRuntime === ConfigurationStatus.ACTIVE ||
                    condition?.statements.length
                  }
                  name="status"
                  onChange={onStatusChange}
                  value="status"
                />

                {statusWarningText && (
                  <div className="mt3 dib">
                    <span>{statusWarningText}</span>
                  </div>
                )}
              </>
            </div>
          </>
        )}

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
              status={status}
              statusFromRuntime={statusFromRuntime}
            />
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
