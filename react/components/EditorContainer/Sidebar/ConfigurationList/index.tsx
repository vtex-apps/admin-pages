import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'
import { Spinner } from 'vtex.styleguide'

import ExtensionConfigurations from '../../../../queries/ExtensionConfigurations.graphql'
import SaveExtension from '../../../../queries/SaveExtension.graphql'
import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaProps,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { FormMetaContext, ModalContext } from '../typings'

import Editor from './Editor'
import List from './List'

const NEW_CONFIGURATION_ID = 'new'

interface ExtensionConfigurationsQuery {
  error: object
  extensionConfigurations: ExtensionConfiguration[]
  loading: boolean
  refetch: (variables?: object) => void
}

interface Props {
  editor: EditorContext
  extensionConfigurations: ExtensionConfigurationsQuery
  iframeRuntime: RenderContext
  intl: ReactIntl.InjectedIntl
  formMeta: FormMetaContext
  modal: ModalContext
  saveExtension: any
}

interface State {
  conditions: string[]
  configuration?: AdaptedExtensionConfiguration
  isEditMode: boolean
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
      conditions: [],
      isEditMode: false,
    }
  }

  public componentDidMount() {
    this.handleConfigurationDefaultState()
  }

  public componentDidUpdate() {
    this.handleConfigurationDefaultState()
  }

  public render() {
    const { editor, formMeta, intl, modal, iframeRuntime } = this.props

    const extensionConfigurationsQuery = this.props.extensionConfigurations

    const { component, props } = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions,
    )

    const componentImplementation = getIframeImplementation(component)

    const componentSchema = getComponentSchema(
      componentImplementation,
      props,
      iframeRuntime,
      intl,
    )

    const shouldRenderSaveButton =
      (this.state.isEditMode &&
        (formMeta.wasModified ||
          (this.state.configuration &&
            this.state.configuration.configurationId ===
              NEW_CONFIGURATION_ID))) ||
      false

    if (extensionConfigurationsQuery.loading) {
      return (
        <div className="mt5 flex justify-center">
          <Spinner />
        </div>
      )
    }

    if (
      extensionConfigurationsQuery.extensionConfigurations &&
      extensionConfigurationsQuery.extensionConfigurations.length > 0 &&
      !this.state.isEditMode
    ) {
      return (
        <List
          activeConfiguration={this.state.configuration}
          configurations={extensionConfigurationsQuery.extensionConfigurations.map(
            configuration => ({
              ...configuration,
              scope: this.getEncodedScope(
                configuration.scope,
                configuration.routeId,
              ),
            }),
          )}
          iframeWindow={this.props.editor.iframeWindow}
          isDisabledChecker={this.isConfigurationDisabled}
          onClose={this.handleQuit}
          onCreate={this.handleConfigurationCreation}
          onEdit={this.handleConfigurationOpen}
          onSelect={this.handleConfigurationSelection}
          title={componentSchema.title}
        />
      )
    }

    return (
      <Editor
        conditions={this.state.conditions}
        configuration={this.state.configuration}
        editor={editor}
        iframeRuntime={iframeRuntime}
        isLoading={formMeta.isLoading && !modal.isOpen}
        newLabel={this.state.newLabel}
        onClose={
          this.state.isEditMode
            ? this.handleConfigurationClose
            : this.handleQuit
        }
        onConditionsChange={this.handleConditionsChange}
        onFormChange={this.handleFormChange}
        onScopeChange={this.handleScopeChange}
        onLabelChange={this.handleConfigurationLabelChange}
        onSave={this.handleConfigurationSave}
        shouldRenderSaveButton={shouldRenderSaveButton}
      />
    )
  }

  private getDecodedRouteId = (scope: ConfigurationScope, routeId: string) =>
    scope === 'site' ? 'store' : routeId

  private getDecodedScope = (scope: ConfigurationScope) =>
    scope === 'site' ? 'route' : scope

  private getEncodedScope = (
    scope: ServerConfigurationScope | ConfigurationScope,
    routeId: string,
  ) => (scope === 'route' && routeId === 'store' ? 'site' : scope)

  private getDefaultConfiguration = (): ExtensionConfiguration => {
    const {
      iframeRuntime,
      editor: { iframeWindow },
    } = this.props

    return {
      allMatches: true,
      conditions: [],
      configurationId: NEW_CONFIGURATION_ID,
      device: iframeRuntime.device,
      propsJSON: '{}',
      routeId: iframeRuntime.page,
      scope: 'route',
      url: iframeWindow.location.pathname,
    }
  }

  private handleConditionsChange = (newConditions: string[]) => {
    this.setState({ conditions: newConditions })

    this.props.formMeta.setWasModified(true)
  }

  private handleConfigurationChange = (
    newConfiguration: ExtensionConfiguration,
  ) => {
    const { editor, iframeRuntime } = this.props

    this.setState(
      {
        conditions: newConfiguration.conditions,
        configuration: {
          ...newConfiguration,
          scope: this.getEncodedScope(
            newConfiguration.scope,
            newConfiguration.routeId,
          ),
        },
      },
      () => {
        iframeRuntime.updateExtension(editor.editTreePath!, {
          component: getExtension(editor.editTreePath, iframeRuntime.extensions)
            .component,
          props: JSON.parse(newConfiguration.propsJSON),
        })
      },
    )
  }

  private handleConfigurationClose = () => {
    const {
      extensionConfigurations: extensionConfigurationsQuery,
      formMeta,
      modal,
    } = this.props

    const configurations = extensionConfigurationsQuery.extensionConfigurations

    if (formMeta.wasModified) {
      modal.open()
    } else {
      this.setState({ isEditMode: false, newLabel: undefined }, () => {
        if (
          configurations.length > 0 &&
          !this.isConfigurationDisabled(configurations[0])
        ) {
          this.handleConfigurationChange(configurations[0])
        } else {
          this.handleQuit()
        }

        if (modal.isOpen) {
          modal.close()
        }
      })
    }
  }

  private handleConfigurationCreation = () => {
    this.handleConfigurationOpen(this.getDefaultConfiguration())
  }

  private handleConfigurationDefaultState = () => {
    const extensionConfigurationsQuery = this.props.extensionConfigurations
    const configurations = extensionConfigurationsQuery.extensionConfigurations
    if (
      !this.state.configuration &&
      !extensionConfigurationsQuery.loading &&
      !extensionConfigurationsQuery.error
    ) {
      if (
        configurations &&
        configurations.length > 0 &&
        !this.isConfigurationDisabled(configurations[0])
      ) {
        this.handleConfigurationChange(configurations[0])
      } else {
        this.handleConfigurationCreation()
      }
    }
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
    const { configuration: currConfiguration } = this.state

    if (
      !currConfiguration ||
      currConfiguration.configurationId !== configuration.configurationId
    ) {
      this.handleConfigurationChange(configuration)
    }

    this.setState({ isEditMode: true })
  }

  private handleConfigurationSave = async () => {
    const {
      editor,
      editor: { iframeWindow },
      formMeta,
      intl,
      modal,
      iframeRuntime,
      saveExtension,
    } = this.props

    const { conditions, configuration } = this.state

    const { allMatches, device } = configuration!

    const configurationId =
      configuration!.configurationId === NEW_CONFIGURATION_ID
        ? undefined
        : configuration!.configurationId

    const { component, props = {} } = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions,
    )

    const componentImplementation = component
      ? getIframeImplementation(component)
      : null

    const pickedProps = getSchemaProps(
      componentImplementation,
      props,
      iframeRuntime,
      intl,
    )

    formMeta.toggleLoading()

    try {
      await saveExtension({
        variables: {
          allMatches,
          conditions,
          configurationId,
          device,
          extensionName: editor.editTreePath,
          label:
            this.state.newLabel !== undefined
              ? this.state.newLabel
              : configuration!.label,
          path: iframeWindow.location.pathname,
          propsJSON: JSON.stringify(pickedProps),
          routeId: this.getDecodedRouteId(configuration!.scope, iframeRuntime.page),
          scope: this.getDecodedScope(configuration!.scope),
        },
      })

      const extensionConfigurationsQuery = this.props.extensionConfigurations

      await extensionConfigurationsQuery.refetch({
        configurationsIds:
          iframeRuntime.extensions[editor.editTreePath as string].configurationsIds,
        routeId: iframeRuntime.page,
        treePath: editor.editTreePath,
        url: iframeWindow.location.pathname,
      })

      formMeta.toggleLoading(this.handleConfigurationDiscard)
    } catch (err) {
      formMeta.toggleLoading(() => {
        if (modal.isOpen) {
          modal.close()
        }

        alert('Something went wrong. Please try again.')

        console.log(err)
      })
    }
  }

  private handleConfigurationSelection = (
    newConfiguration: ExtensionConfiguration,
  ) => {
    const { configuration: currConfiguration } = this.state

    if (
      !currConfiguration ||
      newConfiguration.configurationId !== currConfiguration.configurationId
    ) {
      this.handleConfigurationChange(newConfiguration)
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

    updateExtensionFromForm(
      editTreePath,
      event,
      intl,
      iframeRuntime,
    )
  }

  private handleQuit = (event?: any) => {
    const { editor, iframeRuntime } = this.props

    if (event) {
      event.stopPropagation()
    }

    iframeRuntime.updateRuntime({
      conditions: editor.activeConditions,
      scope: editor.scope,
    })

    editor.editExtensionPoint(null)
  }

  private handleScopeChange = (
    _: React.ChangeEvent<HTMLSelectElement>,
    newScope: ConfigurationScope,
  ) => {
    if (
      this.state.configuration &&
      newScope !== this.state.configuration.scope
    ) {
      this.setState(prevState => ({
        ...prevState,
        conditions: newScope === 'site' ? [] : prevState.conditions,
        configuration: { ...prevState.configuration!, scope: newScope },
        wasModified: true,
      }))
    }
  }

  private isConfigurationDisabled = (configuration: ExtensionConfiguration) => {
    const { iframeWindow } = this.props.editor
    return (
      configuration.scope === 'url' &&
      configuration.url !== iframeWindow.location.pathname
    )
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' }),
  graphql(ExtensionConfigurations, {
    name: 'extensionConfigurations',
    options: ({
      editor: { editTreePath, iframeWindow },
      iframeRuntime: { extensions, page },
    }: Props) => ({
      variables: {
        configurationsIds: extensions[editTreePath as string].configurationsIds,
        routeId: page,
        treePath: editTreePath,
        url: iframeWindow.location.pathname,
      },
    }),
  }),
)(ConfigurationList)
