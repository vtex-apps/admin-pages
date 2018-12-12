import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'
import { Spinner } from 'vtex.styleguide'

import AvailableComponents from '../../../../queries/AvailableComponents.graphql'
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

interface SaveExtensionVariables {
  allMatches?: boolean
  conditions?: string[]
  configurationId?: string
  device?: string
  extensionName: string
  label?: string
  path: string
  propsJSON?: string
  routeId: string
  scope: string
}

interface Props {
  availableComponents: any
  editor: EditorContext
  extensionConfigurations: ExtensionConfigurationsQuery
  intl: ReactIntl.InjectedIntl
  formMeta: FormMetaContext
  modal: ModalContext
  runtime: RenderContext
  saveExtension: ({variables}: {variables: SaveExtensionVariables}) => Promise<any>
}

interface State {
  conditions: SelectOption[]
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
    const { editor, formMeta, intl, modal, runtime } = this.props

    const extensionConfigurationsQuery = this.props.extensionConfigurations

    const { component, props } = getExtension(
      editor.editTreePath,
      runtime.extensions,
    )

    const componentImplementation = getIframeImplementation(component)

    const componentSchema = getComponentSchema(
      componentImplementation,
      props,
      runtime,
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
        runtime={runtime}
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
      runtime,
      editor: { iframeWindow },
    } = this.props

    return {
      allMatches: true,
      conditions: [],
      configurationId: NEW_CONFIGURATION_ID,
      device: runtime.device,
      propsJSON: '{}',
      routeId: runtime.page,
      scope: 'route',
      url: iframeWindow.location.pathname,
    }
  }

  private handleConditionsChange = (newConditions: SelectOption[]) => {
    this.setState({ conditions: newConditions })

    this.props.formMeta.setWasModified(true)
  }

  private handleConfigurationChange = (
    newConfiguration: ExtensionConfiguration,
  ) => {
    const { editor, runtime } = this.props
    const conditions = newConfiguration.conditions.map((value) => ({value, label: value}))
    this.setState(
      {
        conditions,
        configuration: {
          ...newConfiguration,
          scope: this.getEncodedScope(
            newConfiguration.scope,
            newConfiguration.routeId,
          ),
        },
      },
      () => {
        runtime.updateExtension(editor.editTreePath!, {
          component: getExtension(editor.editTreePath, runtime.extensions)
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
      runtime,
      saveExtension,
    } = this.props

    const { conditions: conditionsOptions, configuration } = this.state

    const conditions = conditionsOptions.map(({value}) => value)

    const { allMatches, device } = configuration!

    const configurationId =
      configuration!.configurationId === NEW_CONFIGURATION_ID
        ? undefined
        : configuration!.configurationId

    const { component, props = {} } = getExtension(
      editor.editTreePath,
      runtime.extensions,
    )

    const componentImplementation = component
      ? getIframeImplementation(component)
      : null

    const pickedProps = getSchemaProps(
      componentImplementation,
      props,
      runtime,
      intl,
    )

    formMeta.toggleLoading()

    try {
      if (!editor.editTreePath) {
        throw new Error('No extension name. editor.editTreePath is ' + editor.editTreePath)
      }

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
          routeId: this.getDecodedRouteId(configuration!.scope, runtime.page),
          scope: this.getDecodedScope(configuration!.scope),
        },
      })

      const extensionConfigurationsQuery = this.props.extensionConfigurations

      await extensionConfigurationsQuery.refetch({
        configurationsIds:
          runtime.extensions[editor.editTreePath as string].configurationsIds,
        routeId: runtime.page,
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
      availableComponents: { availableComponents },
      formMeta,
      intl,
      runtime,
      editor: { editTreePath },
    } = this.props

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    updateExtensionFromForm(
      availableComponents,
      editTreePath,
      event,
      intl,
      runtime,
    )
  }

  private handleQuit = (event?: any) => {
    const { editor, runtime } = this.props

    if (event) {
      event.stopPropagation()
    }

    runtime.updateRuntime({
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
  graphql(AvailableComponents, {
    name: 'availableComponents',
    options: (props: Props) => ({
      variables: {
        extensionName: props.editor.editTreePath,
        production: false,
        renderMajor: 7,
      },
    }),
  }),
  graphql(ExtensionConfigurations, {
    name: 'extensionConfigurations',
    options: ({
      editor: { editTreePath, iframeWindow },
      runtime: { extensions, page },
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
