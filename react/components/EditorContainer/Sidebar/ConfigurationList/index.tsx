import { clone } from 'ramda'
import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'
import { Spinner, ToastConsumerFunctions } from 'vtex.styleguide'

import { ListContentQueryResult } from '../../queries/ListContent'

import { DeleteContentMutationFn } from '../../mutations/DeleteContent'
import { SaveContentMutationFn } from '../../mutations/SaveContent'

import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContent,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { FormMetaContext, ModalContext } from '../typings'

import ContentEditor from './ContentEditor'
import LayoutEditor from './LayoutEditor'
import List from './List'

import UpdateBlockMutation from '../../mutations/UpdateBlock'
import { getIsDefaultContent } from '../utils'

const NEW_CONFIGURATION_ID = 'new'

interface Props {
  deleteContent: DeleteContentMutationFn
  editor: EditorContext
  listContent: ListContentQueryResult
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  isSitewide: boolean
  formMeta: FormMetaContext
  modal: ModalContext
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
  template: string
  treePath: string
}

interface State {
  condition: ExtensionConfiguration['condition']
  configuration?: ExtensionConfiguration
  newLabel?: string
}

class ConfigurationList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    props.modal.setHandlers({
      actionHandler: this.handleConfigurationSave,
      cancelHandler: this.handleConfigurationDiscard,
    })

    this.state = {
      condition: this.getDefaultCondition(),
    }
  }

  public render() {
    const { editor, formMeta, intl, modal, iframeRuntime } = this.props

    const listContentQuery = this.props.listContent

    const { component, content } = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    const componentImplementation = getIframeImplementation(component)

    const componentSchema = getComponentSchema(
      componentImplementation,
      content,
      iframeRuntime,
      intl
    )

    const shouldEnableSaveButton =
      (this.state.configuration &&
        (formMeta.wasModified ||
          this.state.configuration.contentId === NEW_CONFIGURATION_ID)) ||
      false

    if (listContentQuery.loading) {
      return (
        <div className="mt5 flex justify-center">
          <Spinner />
        </div>
      )
    }

    if (editor.mode === 'layout') {
      return (
        <UpdateBlockMutation>
          {updateBlock => (
            <LayoutEditor
              editor={editor}
              formMeta={formMeta}
              iframeRuntime={iframeRuntime}
              modal={modal}
              updateBlock={updateBlock}
            />
          )}
        </UpdateBlockMutation>
      )
    }

    if (!this.state.configuration) {
      return (
        <List
          configurations={
            (listContentQuery.data && listContentQuery.data.listContent) || []
          }
          editor={editor}
          isDisabledChecker={this.isConfigurationDisabled}
          isSitewide={this.props.isSitewide}
          onClose={this.handleQuit}
          onDelete={this.handleContentDelete}
          onCreate={this.handleConfigurationCreation}
          onSelect={this.handleConfigurationOpen}
          path={this.props.editor.iframeWindow.location.pathname}
          title={componentSchema.title}
        />
      )
    }

    const label =
      this.state.newLabel !== undefined
        ? this.state.newLabel
        : this.state.configuration && this.state.configuration.label

    return (
      <ContentEditor
        condition={this.state.condition}
        configuration={this.state.configuration}
        editor={editor}
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

  private getDefaultCondition = () => ({
    allMatches: true,
    id: '',
    pageContext: this.props.isSitewide
      ? ({
          id: '*',
          type: '*',
        } as ExtensionConfiguration['condition']['pageContext'])
      : this.props.iframeRuntime.route.pageContext,
    statements: [],
  })

  private getDefaultConfiguration = (): ExtensionConfiguration => ({
    condition: this.getDefaultCondition(),
    contentId: NEW_CONFIGURATION_ID,
    contentJSON: '{}',
    origin: null,
  })

  private handleConditionChange = (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => {
    this.setState(prevState => ({
      ...prevState,
      condition: {
        ...prevState.condition,
        ...changes,
      },
    }))

    this.props.formMeta.setWasModified(true)
  }

  private handleConfigurationChange = (
    newConfiguration: ExtensionConfiguration
  ) => {
    const { editor, iframeRuntime } = this.props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    this.setState(
      {
        condition: newConfiguration.condition,
        configuration: newConfiguration,
      },
      () => {
        iframeRuntime.updateExtension(editor.editTreePath!, {
          ...iframeRuntime.extensions[editor.editTreePath!],
          component: extension.component,
          content:
            newConfiguration.contentId === NEW_CONFIGURATION_ID
              ? extension.content
              : JSON.parse(newConfiguration.contentJSON),
        })
      }
    )
  }

  private handleConfigurationClose = () => {
    const { formMeta, modal } = this.props

    if (formMeta.wasModified) {
      modal.open()
    } else {
      this.setState({ configuration: undefined, newLabel: undefined }, () => {
        if (modal.isOpen) {
          modal.close()
        }
      })
    }
  }

  private handleConfigurationCreation = () => {
    this.handleConfigurationOpen(this.getDefaultConfiguration())
  }

  private handleConfigurationDiscard = () => {
    this.props.formMeta.setWasModified(false, () => {
      this.handleConfigurationClose()
    })
  }

  private handleConfigurationLabelChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ newLabel: event.target.value })

      this.props.formMeta.setWasModified(true)
    }
  }

  private handleConfigurationOpen = (configuration: ExtensionConfiguration) => {
    const { editor, iframeRuntime } = this.props
    const { configuration: currConfiguration } = this.state

    const originalBlock = clone(iframeRuntime.extensions[editor.editTreePath!])

    if (
      !currConfiguration ||
      currConfiguration.contentId !== configuration.contentId
    ) {
      this.handleConfigurationChange(configuration)
    }

    this.props.modal.setHandlers({
      closeCallbackHandler: () => {
        iframeRuntime.updateExtension(editor.editTreePath!, originalBlock)
      },
    })

    this.setState({ configuration })
  }

  private refetchConfigurations = async () => {
    const {
      editor,
      iframeRuntime,
      listContent,
      template,
      treePath,
    } = this.props

    return await listContent.refetch({
      blockId: iframeRuntime.extensions[editor.editTreePath!].blockId,
      pageContext: iframeRuntime.route.pageContext,
      template,
      treePath,
    })
  }

  private handleConfigurationSave = async () => {
    const {
      editor,
      formMeta,
      intl,
      modal,
      iframeRuntime,
      saveContent,
      template,
      treePath,
    } = this.props

    const { component, content = {} } = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    const componentImplementation = component
      ? getIframeImplementation(component)
      : null

    const pickedContent = getSchemaPropsOrContent(
      componentImplementation,
      content,
      iframeRuntime,
      intl,
      true
    )

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
      contentJSON: JSON.stringify(pickedContent),
      label,
      origin:
        (this.state.configuration && this.state.configuration.origin) || null,
    }

    formMeta.toggleLoading()

    try {
      await saveContent({
        variables: {
          configuration,
          template,
          treePath,
        },
      })

      await this.refetchConfigurations()

      formMeta.toggleLoading(this.handleConfigurationDiscard)
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

  private handleContentDelete = async (
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

      editor.setIsLoading(false)

      this.props.iframeRuntime.updateRuntime()

      await this.refetchConfigurations()

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

  private handleFormChange = (event: IChangeEvent) => {
    const {
      formMeta,
      intl,
      iframeRuntime,
      editor: { editTreePath },
    } = this.props

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    updateExtensionFromForm(editTreePath, event, intl, iframeRuntime, true)
  }

  private handleQuit = (event?: any) => {
    const { editor, iframeRuntime } = this.props

    if (event) {
      event.stopPropagation()
    }

    iframeRuntime.updateRuntime({
      conditions: editor.activeConditions,
    })

    editor.editExtensionPoint(null)
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
}

export default injectIntl(ConfigurationList)
