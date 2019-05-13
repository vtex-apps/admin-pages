import { JSONSchema6 } from 'json-schema'
import { clone, path } from 'ramda'
import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'
import { formatIOMessage } from 'vtex.native-types'
import { RenderComponent } from 'vtex.render-runtime'
import { ToastConsumerFunctions } from 'vtex.styleguide'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContent,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { DeleteContentMutationFn } from '../../mutations/DeleteContent'
import { SaveContentMutationFn } from '../../mutations/SaveContent'
import {
  ListContentData,
  ListContentQueryResult,
} from '../../queries/ListContent'
import { FormMetaContext, ModalContext } from '../typings'
import { getIsDefaultContent } from '../utils'

import { NEW_CONFIGURATION_ID } from './consts'
import ContentEditor from './ContentEditor'
import List from './List'

interface Props {
  deleteContent: DeleteContentMutationFn
  editor: EditorContext
  formMeta: FormMetaContext
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  isSitewide: boolean
  modal: ModalContext
  queryData?: ListContentData
  refetch: ListContentQueryResult['refetch']
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
  template: string
  treePath: string
}

interface State {
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  formData?: object
  messages?: RenderRuntime['messages']
  newLabel?: string
}

defineMessages({
  deleteError: {
    defaultMessage: 'Something went wrong.',
    id: 'admin/pages.editor.components.content.delete.error',
  },
  deleteSuccess: {
    defaultMessage: 'Content deleted.',
    id: 'admin/pages.editor.components.content.delete.success',
  },
  resetError: {
    defaultMessage: 'Error resetting content.',
    id: 'admin/pages.editor.components.content.reset.error',
  },
  resetSuccess: {
    defaultMessage: 'Content reset.',
    id: 'admin/pages.editor.components.content.reset.success',
  },
})

class ConfigurationList extends React.Component<Props, State> {
  private component: Extension['component']
  private componentImplementation: RenderComponent<any, any> | null
  private componentProperties: ComponentSchema['properties']
  private componentTitle: ComponentSchema['title']
  private contentSchema: JSONSchema6

  constructor(props: Props) {
    super(props)

    const { editor, iframeRuntime, intl, modal, queryData } = props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    this.component = extension.component

    this.componentImplementation = getIframeImplementation(this.component)

    const listContent = queryData && queryData.listContentWithSchema

    this.contentSchema = listContent && JSON.parse(listContent.schemaJSON)

    const componentSchema = getComponentSchema({
      component: this.componentImplementation,
      contentSchema: this.contentSchema,
      propsOrContent: extension.content,
      runtime: iframeRuntime,
    })

    this.componentProperties = componentSchema.properties

    this.componentTitle = componentSchema.title
      ? formatIOMessage({
          id: componentSchema.title,
          intl,
        })
      : ''

    modal.setHandlers({
      actionHandler: this.handleConfigurationSave,
      cancelHandler: this.handleConfigurationDiscard,
    })

    this.state = {
      condition: this.getDefaultCondition(),
    }
  }

  public render() {
    const { editor, formMeta, iframeRuntime, modal, queryData } = this.props

    const listContent = queryData && queryData.listContentWithSchema

    const configurations = (listContent && listContent.content) || []

    const shouldEnableSaveButton =
      (this.state.configuration &&
        (formMeta.wasModified ||
          this.state.configuration.contentId === NEW_CONFIGURATION_ID)) ||
      false

    if (!this.state.configuration) {
      return (
        <List
          configurations={configurations}
          editor={editor}
          isDisabledChecker={this.isConfigurationDisabled}
          isSitewide={this.props.isSitewide}
          onClose={this.handleQuit}
          onDelete={this.handleConfigurationDeletion}
          onCreate={this.handleConfigurationCreation}
          onSelect={this.handleConfigurationOpen}
          path={this.props.editor.iframeWindow.location.pathname}
          title={this.componentTitle}
        />
      )
    }

    const label =
      this.state.newLabel !== undefined
        ? this.state.newLabel
        : this.state.configuration && this.state.configuration.label

    return (
      <ContentEditor
        componentTitle={this.componentTitle}
        condition={this.state.condition}
        configuration={this.state.configuration}
        contentSchema={this.contentSchema}
        iframeRuntime={iframeRuntime}
        isLoading={formMeta.isLoading && !modal.isOpen}
        isSitewide={this.props.isSitewide}
        label={label}
        onClose={
          this.state.configuration
            ? this.handleConfigurationClose
            : this.handleQuit
        }
        onConditionChange={this.handleConditionChange}
        onFormChange={this.handleFormChange}
        onLabelChange={this.handleConfigurationLabelChange}
        onSave={this.handleConfigurationSave}
        shouldDisableSaveButton={!shouldEnableSaveButton}
      />
    )
  }

  private getDefaultCondition = () => {
    const { iframeRuntime, isSitewide } = this.props

    return {
      allMatches: true,
      id: '',
      pageContext: isSitewide
        ? ({
            id: '*',
            type: '*',
          } as ExtensionConfiguration['condition']['pageContext'])
        : iframeRuntime.route.pageContext,
      statements: [],
    }
  }

  private getDefaultConfiguration = (): ExtensionConfiguration => ({
    condition: this.getDefaultCondition(),
    contentId: NEW_CONFIGURATION_ID,
    contentJSON: '{}',
    origin: null,
  })

  private getFormData = (content: object): object =>
    getSchemaPropsOrContentFromRuntime({
      component: this.componentImplementation,
      contentSchema: this.contentSchema,
      isContent: true,
      messages: this.props.editor.messages,
      propsOrContent: content,
      runtime: this.props.iframeRuntime,
    }) || {}

  private handleConditionChange = (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => {
    const { formMeta } = this.props

    this.setState(prevState => ({
      ...prevState,
      condition: {
        ...prevState.condition,
        ...changes,
      },
    }))

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }
  }

  private handleConfigurationClose = () => {
    const { editor, formMeta, iframeRuntime, modal } = this.props

    if (formMeta.getWasModified()) {
      modal.open()
    } else {
      this.setState(
        {
          configuration: undefined,
          formData: undefined,
          messages: undefined,
          newLabel: undefined,
        },
        () => {
          if (modal.isOpen) {
            modal.close()
          }

          iframeRuntime.updateRuntime({
            conditions: editor.activeConditions,
          })
        }
      )
    }
  }

  private handleConfigurationCreation = () => {
    this.handleConfigurationOpen(this.getDefaultConfiguration())
  }

  private handleConfigurationDeletion = async (
    configuration: ExtensionConfiguration
  ) => {
    const { editor, iframeRuntime, intl, template, treePath } = this.props

    editor.setIsLoading(true)

    const action = getIsDefaultContent(configuration) ? 'reset' : 'delete'

    try {
      await this.props.deleteContent({
        variables: {
          contentId: configuration.contentId,
          pageContext: iframeRuntime.route.pageContext,
          template,
          treePath,
        },
      })

      this.props.iframeRuntime.updateRuntime()

      await this.refetchConfigurations()

      editor.setIsLoading(false)

      this.props.showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage({
          id: `admin/pages.editor.components.content.${action}.success`,
        }),
      })
    } catch (e) {
      editor.setIsLoading(false)

      this.props.showToast({
        horizontalPosition: 'right',
        message: intl.formatMessage({
          id: `admin/pages.editor.components.content.${action}.error`,
        }),
      })

      console.error(e)
    }
  }

  private handleConfigurationDiscard = () => {
    this.props.formMeta.setWasModified(false, () => {
      if (this.state.messages) {
        this.props.editor.addMessages(this.state.messages)
      }

      this.handleConfigurationClose()
    })
  }

  private handleConfigurationLabelChange = (event: Event) => {
    const { formMeta } = this.props

    if (event.target instanceof HTMLInputElement) {
      this.setState({ newLabel: event.target.value })

      if (!formMeta.wasModified) {
        formMeta.setWasModified(true)
      }
    }
  }

  private handleConfigurationOpen = (
    newConfiguration: ExtensionConfiguration
  ) => {
    const { editor, iframeRuntime } = this.props

    const baseContent =
      newConfiguration.contentId !== NEW_CONFIGURATION_ID
        ? (JSON.parse(newConfiguration.contentJSON) as object)
        : {}

    const formData = this.getFormData(baseContent)

    this.setState({
      condition: newConfiguration.condition,
      configuration: newConfiguration,
      formData,
      messages: editor.messages,
    })

    iframeRuntime.updateExtension(editor.editTreePath!, {
      ...iframeRuntime.extensions[editor.editTreePath!],
      component: this.component,
      content: formData,
    })
  }

  private handleConfigurationSave = async () => {
    const {
      editor,
      formMeta,
      modal,
      iframeRuntime,
      saveContent,
      template,
      treePath,
    } = this.props

    const content = getSchemaPropsOrContent({
      isContent: true,
      messages: editor.messages,
      properties: this.componentProperties,
      propsOrContent: this.state.formData,
    })

    const contentId =
      this.state.configuration!.contentId === NEW_CONFIGURATION_ID
        ? null
        : this.state.configuration!.contentId

    const label =
      this.state.newLabel !== undefined
        ? this.state.newLabel
        : this.state.configuration!.label

    const configuration = {
      ...this.state.configuration,
      condition: this.state.condition,
      contentId,
      contentJSON: JSON.stringify(content),
      label,
      origin:
        (this.state.configuration && this.state.configuration.origin) || null,
    }

    const blockId = path<string>(
      ['extensions', editor.editTreePath || '', 'blockId'],
      iframeRuntime
    )

    formMeta.toggleLoading()

    try {
      await saveContent({
        variables: {
          blockId,
          configuration,
          lang: iframeRuntime.culture.locale,
          template,
          treePath,
        },
      })

      await this.refetchConfigurations()

      formMeta.toggleLoading(() => {
        this.props.formMeta.setWasModified(false, () => {
          this.handleConfigurationClose()
        })
      })
    } catch (err) {
      formMeta.toggleLoading(() => {
        if (modal.isOpen) {
          modal.close()
        }

        this.props.showToast({
          horizontalPosition: 'right',
          message: 'Something went wrong. Please try again.',
        })

        console.log(err)
      })
    }
  }

  private handleFormChange = (event: IChangeEvent) => {
    const { formMeta, iframeRuntime, editor } = this.props

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    if (event.formData) {
      this.setState({ formData: event.formData })

      updateExtensionFromForm({
        data: event.formData,
        isContent: true,
        runtime: iframeRuntime,
        treePath: editor.editTreePath!,
      })
    }
  }

  private handleQuit = (event?: Event) => {
    if (event) {
      event.stopPropagation()
    }

    this.props.editor.editExtensionPoint(null)
  }

  private isConfigurationDisabled = (configuration: ExtensionConfiguration) => {
    const configurationPageContext = configuration.condition.pageContext

    const iframeRuntimePageContext = this.props.iframeRuntime.route.pageContext

    if (configurationPageContext.type === '*') {
      return false
    }

    if (configurationPageContext.type !== iframeRuntimePageContext.type) {
      return true
    }

    if (configurationPageContext.id === '*') {
      return false
    }

    return configurationPageContext.id !== iframeRuntimePageContext.id
  }

  private refetchConfigurations = async () => {
    const { editor, iframeRuntime, refetch, template, treePath } = this.props

    return await refetch({
      blockId: iframeRuntime.extensions[editor.editTreePath!].blockId,
      pageContext: iframeRuntime.route.pageContext,
      template,
      treePath,
    })
  }
}

export default injectIntl(ConfigurationList)
