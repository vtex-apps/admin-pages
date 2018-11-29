import { filter, keys, merge, reduce } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'
import { RenderComponent } from 'render'
import { IconArrowBack, Spinner } from 'vtex.styleguide'

import AvailableComponents from '../../../../queries/AvailableComponents.graphql'
import ExtensionConfigurations from '../../../../queries/ExtensionConfigurations.graphql'
import SaveExtension from '../../../../queries/SaveExtension.graphql'
import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
} from '../../../../utils/components'
import Modal from '../../../Modal'

import Editor from './Editor'
import List from './List'
import SaveButton from './SaveButton'

const NEW_CONFIGURATION_ID = 'new'

interface ExtensionConfigurationsQuery {
  error: object
  extensionConfigurations: ExtensionConfiguration[]
  loading: boolean
  refetch: (variables?: object) => void
}

interface Props {
  availableComponents: any
  editor: EditorContext
  extensionConfigurations: ExtensionConfigurationsQuery
  intl: ReactIntl.InjectedIntl
  runtime: RenderContext
  saveExtension: any
}

interface State {
  conditions: string[]
  configuration?: AdaptedExtensionConfiguration
  isEditMode: boolean
  isLoading: boolean
  isModalOpen: boolean
  newLabel?: string
  wasModified: boolean
}

class ConfigurationList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      conditions: [],
      isEditMode: false,
      isLoading: false,
      isModalOpen: false,
      wasModified: false,
    }
  }

  public componentDidMount() {
    this.handleConfigurationDefaultState()
  }

  public componentDidUpdate() {
    this.handleConfigurationDefaultState()
  }

  public getSchemaProps = (
    component: RenderComponent<any, any> | null,
    props: any,
    runtime: RenderContext,
  ) => {
    if (!component) {
      return null
    }

    /**
     * Recursively get the props defined in the properties.
     *
     * @param {object} properties The schema properties
     * @param {object} prevProps The previous props passed to the component
     * @return {object} Actual component props
     */
    const getPropsFromSchema = (properties: any = {}, prevProps: any): object =>
      reduce(
        (nextProps, key) =>
          merge(nextProps, {
            [key]:
              properties[key].type === 'object'
                ? getPropsFromSchema(properties[key].properties, prevProps[key])
                : prevProps[key],
          }),
        {},
        filter(v => prevProps[v] !== undefined, keys(properties)),
      )

    const componentSchema = getComponentSchema(
      component,
      props,
      runtime,
      this.props.intl,
    )

    return getPropsFromSchema(componentSchema.properties, props)
  }

  public render() {
    const { editor, intl, runtime } = this.props

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
      this.state.isEditMode &&
      (this.state.wasModified ||
        (this.state.configuration &&
          this.state.configuration.configurationId === NEW_CONFIGURATION_ID))

    return (
      <div className="w-100 dark-gray">
        <Modal
          isActionLoading={this.state.isLoading}
          isOpen={this.state.isModalOpen}
          onClickAction={this.handleConfigurationSave}
          onClickCancel={this.handleConfigurationDiscard}
          onClose={this.handleModalClose}
          textButtonAction={intl.formatMessage({
            id: 'pages.editor.components.button.save',
          })}
          textButtonCancel={intl.formatMessage({
            id: 'pages.editor.components.modal.button.discard',
          })}
          textMessage={intl.formatMessage({
            id: 'pages.editor.components.modal.text',
          })}
        />
        <div className="w-100 flex items-center pl5 pt5 bt b--light-silver">
          <span
            className="pointer"
            onClick={
              this.state.isEditMode
                ? this.handleConfigurationClose
                : this.handleQuit
            }
          >
            <IconArrowBack size={16} color="#585959" />
          </span>
          <div className="w-100 pl5 flex justify-between items-center">
            <h4 className="mv0 f6 fw5 dark-gray b--transparent ba bw1 pv3">
              {componentSchema.title}
            </h4>
            {shouldRenderSaveButton && (
              <SaveButton
                isLoading={this.state.isLoading}
                onClick={this.handleConfigurationSave}
                variation="tertiary"
              />
            )}
          </div>
        </div>
        {extensionConfigurationsQuery.loading ? (
          <div className="mt5 flex justify-center">
            <Spinner />
          </div>
        ) : extensionConfigurationsQuery.extensionConfigurations &&
          extensionConfigurationsQuery.extensionConfigurations.length > 0 &&
          !this.state.isEditMode ? (
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
                isDisabledChecker={this.isConfigurationDisabled}
                onCreate={this.handleConfigurationCreation}
                onEdit={this.handleConfigurationOpen}
                onSelect={this.handleConfigurationSelection}
                iframeWindow={this.props.editor.iframeWindow}
              />
            ) : (
              <Editor
                conditions={this.state.conditions}
                configuration={this.state.configuration}
                editor={editor}
                newLabel={this.state.newLabel}
                onConditionsChange={this.handleConditionsChange}
                onFormChange={this.handleFormChange}
                onScopeChange={this.handleScopeChange}
                onLabelChange={this.handleConfigurationLabelChange}
                onSave={this.handleConfigurationSave}
                runtime={runtime}
              />
            )}
      </div>
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

  private handleConditionsChange = (newConditions: string[]) => {
    this.setState({ conditions: newConditions, wasModified: true })
  }

  private handleConfigurationChange = (
    newConfiguration: ExtensionConfiguration,
  ) => {
    const { editor, runtime } = this.props

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
        runtime.updateExtension(editor.editTreePath!, {
          component: getExtension(editor.editTreePath, runtime.extensions)
            .component,
          props: JSON.parse(newConfiguration.propsJSON),
        })
      },
    )
  }

  private handleConfigurationClose = () => {
    const { extensionConfigurations: extensionConfigurationsQuery } = this.props

    const configurations = extensionConfigurationsQuery.extensionConfigurations

    if (this.state.wasModified) {
      this.handleModalOpen()
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
    this.setState({ wasModified: false }, () => {
      this.handleModalResolution()
    })
  }

  private handleConfigurationLabelChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState({ newLabel: event.target.value, wasModified: true })
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
      runtime,
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
      runtime.extensions,
    )

    const componentImplementation = component
      ? getIframeImplementation(component)
      : null

    const pickedProps = this.getSchemaProps(
      componentImplementation,
      props,
      runtime,
    )

    this.setState({
      isLoading: true,
    })

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

      this.setState(
        {
          isLoading: false,
          wasModified: false,
        },
        () => {
          if (this.state.isModalOpen) {
            this.handleModalResolution()
          } else {
            this.handleConfigurationClose()
          }
        },
      )
    } catch (err) {
      this.setState(
        {
          isLoading: false,
        },
        () => {
          if (this.state.isModalOpen) {
            this.handleModalClose()
          }

          alert('Something went wrong. Please try again.')

          console.log(err)
        },
      )
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
      runtime: { updateExtension, updateComponentAssets },
      runtime,
      editor: { editTreePath },
    } = this.props
    const { component: enumComponent } = event.formData
    const component =
      enumComponent && enumComponent !== '' ? enumComponent : null
    const componentImplementation =
      component && getIframeImplementation(component)

    if (!this.state.wasModified) {
      this.setState({ wasModified: true })
    }

    if (component && !componentImplementation) {
      const allComponents = reduce(
        (acc: { [key: string]: any }, currComponent: any) => {
          acc[currComponent.name] = {
            assets: currComponent.assets,
            dependencies: currComponent.dependencies,
          }
          return acc
        },
        {},
        this.props.availableComponents.availableComponents,
      )

      updateComponentAssets(allComponents)
    }

    const props = this.getSchemaProps(
      componentImplementation,
      event.formData,
      runtime,
    )

    updateExtension(editTreePath as string, {
      component,
      props,
    })
  }

  private handleModalClose = () => {
    this.setState({ isModalOpen: false })
  }

  private handleModalOpen = () => {
    this.setState({ isModalOpen: true })
  }

  private handleModalResolution = () => {
    this.handleModalClose()
    this.handleConfigurationClose()
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
