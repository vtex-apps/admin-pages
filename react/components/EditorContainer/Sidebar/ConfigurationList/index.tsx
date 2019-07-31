import { ApolloQueryResult } from 'apollo-client'
import { JSONSchema6 } from 'json-schema'
import throttle from 'lodash/throttle'
import { clone, Dictionary, equals, isEmpty, path, pickBy } from 'ramda'
import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { FormProps } from 'react-jsonschema-form'
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
import { getIsDefaultContent, isUnidentifiedPageContext } from '../utils'

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
  newLabel?: string
}

const messages = defineMessages({
  deleteError: {
    defaultMessage: 'Something went wrong.',
    id: 'admin/pages.editor.components.content.delete.error',
  },
  deleteSuccess: {
    defaultMessage: 'Content deleted.',
    id: 'admin/pages.editor.components.content.delete.success',
  },
  pageContextError: {
    defaultMessage:
      'Could not identify {entity}. The configuration will be set to "{template}".',
    id: 'admin/pages.editor.components.condition.toast.error.page-context',
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

const omitUndefined = pickBy(val => typeof val !== 'undefined')

class ConfigurationList extends React.Component<Props, State> {
  private component: Extension['component']
  private componentImplementation: RenderComponent<any, any> | null
  private componentSchema: ComponentSchema
  private componentTitle: ComponentSchema['title']
  private contentSchema: JSONSchema6
  private activeExtension: Extension

  private throttledUpdateExtensionFromForm: typeof updateExtensionFromForm = throttle(
    data => updateExtensionFromForm(data),
    200
  )

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
      isContent: true,
      propsOrContent: extension.content,
      runtime: iframeRuntime,
    })

    this.componentSchema = componentSchema

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

    this.activeExtension = clone(extension)
  }

  public render() {
    const { iframeRuntime, queryData } = this.props

    const listContent = queryData && queryData.listContentWithSchema

    const configurations = (listContent && listContent.content) || []

    if (!this.state.configuration) {
      return (
        <List
          configurations={configurations}
          isDisabledChecker={this.isConfigurationDisabled}
          isSitewide={this.props.isSitewide}
          onClose={this.handleQuit}
          onDelete={this.handleConfigurationDeletion}
          onCreate={this.handleConfigurationCreation}
          onSelect={this.handleConfigurationOpen}
          title={this.componentTitle}
        />
      )
    }

    return (
      <ContentEditor
        componentTitle={this.state.newLabel}
        condition={this.state.condition}
        contentSchema={this.contentSchema}
        data={this.state.formData}
        iframeRuntime={iframeRuntime}
        isDefault={getIsDefaultContent(this.state.configuration)}
        isNew={this.state.configuration.contentId === NEW_CONFIGURATION_ID}
        isSitewide={this.props.isSitewide}
        onClose={this.handleContentBack}
        onConditionChange={this.handleConditionChange}
        onFormChange={this.handleFormChange}
        onTitleChange={this.handleConfigurationTitleChange}
        onSave={this.handleConfigurationSave}
      />
    )
  }

  private getDefaultCondition = (): ExtensionConfiguration['condition'] => {
    const { iframeRuntime, isSitewide } = this.props

    const iframePageContext = iframeRuntime.route.pageContext

    const pageContext: ExtensionConfiguration['condition']['pageContext'] = isSitewide
      ? {
          id: '*',
          type: '*',
        }
      : {
          id: isUnidentifiedPageContext(iframePageContext)
            ? '*'
            : iframePageContext.id,
          type: iframePageContext.type,
        }

    return {
      allMatches: true,
      id: '',
      pageContext,
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
      messages: this.props.iframeRuntime.messages,
      propsOrContent: content,
      runtime: this.props.iframeRuntime,
    }) || {}

  private getNewActiveExtension = (
    queryResult: ApolloQueryResult<ListContentData>
  ) => {
    const { editor, iframeRuntime } = this.props

    const partialNewActiveExtension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    const newListContent =
      queryResult.data && queryResult.data.listContentWithSchema

    const newConfigurations = (newListContent && newListContent.content) || []

    const newActiveConfiguration =
      newConfigurations.find(configuration =>
        partialNewActiveExtension.contentMapId.startsWith(
          configuration.contentId
        )
      ) ||
      newConfigurations[0] ||
      {}

    const newActiveContentJson = newActiveConfiguration.contentJSON

    const newActiveContent: object = newActiveContentJson
      ? JSON.parse(newActiveContentJson)
      : {}

    return {
      ...partialNewActiveExtension,
      content: newActiveContent,
    }
  }

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

    if (!formMeta.getWasModified()) {
      formMeta.setWasModified(true)
    }
  }

  private handleContentBack = async () => {
    const { editor, formMeta, iframeRuntime } = this.props

    this.handleConfigurationClose()

    if (!formMeta.getWasModified()) {
      updateExtensionFromForm({
        data: this.activeExtension.content,
        isContent: true,
        runtime: iframeRuntime,
        treePath: editor.editTreePath!,
      })
    }
  }

  private handleConfigurationClose = () => {
    const { editor, formMeta, modal } = this.props

    if (formMeta.getWasModified()) {
      modal.open()
    } else {
      this.setState(
        {
          configuration: undefined,
          formData: undefined,
          newLabel: undefined,
        },
        async () => {
          if (modal.isOpen) {
            modal.close()
          }

          if (!isEmpty(formMeta.getI18nMapping())) {
            formMeta.clearI18nMapping()
          }

          editor.setIsLoading(false)
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

      await this.updateIframeAndStorefront()

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
      this.handleContentBack()
    })
  }

  private handleConfigurationOpen = async (
    newConfiguration: ExtensionConfiguration
  ) => {
    const { editor, iframeRuntime, intl, showToast } = this.props

    const baseContent =
      newConfiguration.contentId !== NEW_CONFIGURATION_ID
        ? (JSON.parse(newConfiguration.contentJSON) as object)
        : {}

    const formData = this.getFormData(baseContent)

    editor.setIsLoading(true)

    await iframeRuntime.updateExtension(editor.editTreePath!, {
      ...iframeRuntime.extensions[editor.editTreePath!],
      component: this.component,
      content: formData,
    })

    this.setState(
      {
        condition: newConfiguration.condition,
        configuration: newConfiguration,
        formData,
        newLabel: newConfiguration.label,
      },
      () => {
        editor.setIsLoading(false)

        const { pageContext } = this.state.condition

        if (isUnidentifiedPageContext(pageContext)) {
          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(
              {
                id: messages.pageContextError.id,
              },
              {
                entity: intl.formatMessage({
                  id: `admin/pages.editor.components.condition.scope.entity.${pageContext.type}`,
                }),
                template: intl.formatMessage({
                  id: 'admin/pages.editor.components.condition.scope.template',
                }),
              }
            ),
          })
        }
      }
    )
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

    if (editor.getIsLoading()) {
      return
    }

    const i18nMapping = formMeta.getI18nMapping()

    const content = getSchemaPropsOrContent({
      i18nMapping,
      messages: iframeRuntime.messages,
      propsOrContent: this.state.formData,
      schema: this.componentSchema,
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

    try {
      editor.setIsLoading(true)

      await saveContent({
        variables: {
          blockId,
          configuration,
          lang: iframeRuntime.culture.locale,
          template,
          treePath,
        },
      })

      await this.updateIframeAndStorefront()

      this.props.formMeta.setWasModified(false, () => {
        this.handleConfigurationClose()
      })
    } catch (err) {
      editor.setIsLoading(false)

      if (modal.isOpen) {
        modal.close()
      }

      this.props.showToast({
        horizontalPosition: 'right',
        message: 'Something went wrong. Please try again.',
      })

      console.log(err)
    }
  }

  private handleConfigurationTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { formMeta } = this.props

    this.setState({ newLabel: event.target.value })

    if (!formMeta.getWasModified()) {
      formMeta.setWasModified(true)
    }
  }

  private handleFormChange: FormProps<{
    formData: object
  }>['onChange'] = event => {
    const { formMeta, iframeRuntime, editor } = this.props

    if (
      !formMeta.getWasModified() &&
      !equals(
        omitUndefined((this.state.formData || {}) as Dictionary<any>),
        omitUndefined(event.formData)
      )
    ) {
      formMeta.setWasModified(true)
    }

    if (event.formData) {
      this.setState({ formData: event.formData })

      this.throttledUpdateExtensionFromForm({
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

  private updateIframeAndStorefront = async () => {
    const { editor, iframeRuntime } = this.props

    const newListContent = await this.refetchConfigurations()

    await iframeRuntime.updateRuntime({
      conditions: editor.activeConditions,
    })

    this.activeExtension = this.getNewActiveExtension(newListContent)
  }
}

export default injectIntl(ConfigurationList)
