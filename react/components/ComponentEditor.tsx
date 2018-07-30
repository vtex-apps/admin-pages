import {
  filter,
  has,
  keys,
  map,
  merge,
  pick,
  pickBy,
  prop,
  reduce,
  mergeDeepLeft,
} from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'
import {
  Badge,
  Button,
  Card,
  IconArrowBack,
  Modal,
  Spinner,
} from 'vtex.styleguide'

import PathMinus from '../images/PathMinus'

import AvailableComponents from '../queries/AvailableComponents.graphql'
import ExtensionConfigurations from '../queries/ExtensionConfigurations.graphql'
import SaveExtension from '../queries/SaveExtension.graphql'
import { getImplementation } from '../utils/components'

import ConditionsSelector from './conditions/ConditionsSelector'
import ArrayFieldTemplate from './form/ArrayFieldTemplate'
import BaseInput from './form/BaseInput'
import Dropdown from './form/Dropdown'
import ErrorListTemplate from './form/ErrorListTemplate'
import FieldTemplate from './form/FieldTemplate'
import ImageUploader from './form/ImageUploader'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'
import Radio from './form/Radio'
import TextArea from './form/TextArea'
import Toggle from './form/Toggle'
import ModeSwitcher from './ModeSwitcher'

const defaultUiSchema = {
  classNames: 'editor-form',
}

const widgets = {
  BaseInput,
  CheckboxWidget: Toggle,
  RadioWidget: Radio,
  SelectWidget: Dropdown,
  TextareaWidget: TextArea,
  'image-uploader': ImageUploader,
}

const MODES = ['content', 'layout']

type ComponentEditorMode = 'content' | 'layout'

interface ExtensionConfigurationsQuery {
  error: object
  extensionConfigurations: ExtensionConfiguration[]
  loading: boolean
  refetch: (variables?: object) => void
}

interface ComponentEditorProps extends RenderContextProps, EditorContextProps {
  availableComponents: any
  extensionConfigurations: ExtensionConfigurationsQuery
  intl: ReactIntl.InjectedIntl
  saveExtension: any
}

interface ComponentEditorState {
  conditions: string[]
  configuration?: ExtensionConfiguration
  isEditMode: boolean
  isLoading: boolean
  isModalOpen: boolean
  mode: ComponentEditorMode
  scope: ConfigurationScope
  wasModified: boolean
}

class ComponentEditor extends Component<
  ComponentEditorProps,
  ComponentEditorState
> {
  private _isMounted: boolean = false

  constructor(props: ComponentEditorProps) {
    super(props)

    this.state = {
      conditions: [],
      isEditMode: false,
      isLoading: false,
      isModalOpen: false,
      mode: 'content',
      scope: 'url',
      wasModified: false,
    }
  }

  public componentDidMount() {
    this._isMounted = true

    this.handleConfigurationDefaultState()
  }

  public componentDidUpdate() {
    this.handleConfigurationDefaultState()
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  public getSchemaProps = (component, props, runtime) => {
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
    const getPropsFromSchema = (properties = {}, prevProps) =>
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

    const componentSchema = this.getComponentSchema(component, props, runtime)

    return getPropsFromSchema(componentSchema.properties, props)
  }

  public isEmptyExtensionPoint = component =>
    /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(component)

  /**
   * It receives a component implementation and decide which type of schema
   * will use, a static (schema) or a dynamic (getSchema) schema.
   * If none, returns a JSON specifying a simple static schema.
   *
   * @param {object} component The component implementation
   * @param {object} props The component props to be passed to the getSchema
   */
  public getComponentSchema = (component, props, runtime) => {
    const componentSchema = (component &&
      (component.schema ||
        (component.getSchema &&
          component.getSchema(props, { routes: runtime.pages })))) || {
      properties: {},
      type: 'object',
    }

    /**
     * Traverse the schema properties searching for the title, description and enum
     * properties and translate their value using the messages from the intl context
     *
     * @param {object} schema Schema to be translated
     * @return {object} Schema with title, description and enumNames properties translated
     */
    const traverseAndTranslate: (schema: object) => object = schema => {
      const translate: (
        value: string | { id: string; values: object },
      ) => string = value =>
        typeof value === 'string'
          ? this.props.intl.formatMessage({ id: value })
          : this.props.intl.formatMessage({ id: value.id }, value.values || {})

      const translatedSchema = map(
        value =>
          Array.isArray(value) ? map(translate, value) : translate(value),
        pick(['title', 'description', 'enumNames'], schema),
      )

      if (has('widget', schema)) {
        translatedSchema.widget = merge(
          schema.widget,
          map(
            translate,
            pick(
              ['ui:help', 'ui:title', 'ui:description', 'ui:placeholder'],
              schema.widget,
            ),
          ),
        )
      }

      if (schema.type === 'object') {
        translatedSchema.properties = reduce(
          (properties, key) =>
            merge(properties, {
              [key]: traverseAndTranslate(schema.properties[key]),
            }),
          {},
          keys(schema.properties),
        )
      }

      if (schema.type === 'array') {
        translatedSchema.items = traverseAndTranslate(schema.items)

        if (!schema.minItems || schema.minItems < 1) {
          translatedSchema.minItems = 1
        }

        translatedSchema.items.properties = {
          __editorItemTitle: {
            default: translatedSchema.items.title,
            title: 'Item title',
            type: 'string',
          },
          ...translatedSchema.items.properties,
        }
      }

      return merge(schema, translatedSchema)
    }

    return traverseAndTranslate(componentSchema)
  }

  /**
   * Generates an `UiSchema` following the `Component Schema` definition of `widgets`.
   * Each schema property can define an widget especifying how to display it.
   * @param {object} componentUiSchema The default static `UiSchema` definition
   * @param {object} componentSchema The full `Component Schema` (already
   *  applyed the `getSchema`, if its the case)
   * @return {object} A object defining the complete `UiSchema` that matches all the schema
   *  properties.
   */
  public getUiSchema = (componentUiSchema, componentSchema) => {
    /**
     * It goes deep into the schema tree to find widget definitions, generating
     * the correct path to the property.
     * e.g:
     * {
     *   banner1: {
     *     numberOfLines: {
     *       value: {
     *         'ui:widget': 'range'
     *       }
     *     }
     *   }
     * }
     *
     * @param {object} properties The schema properties to be analysed.
     */
    const getDeepUiSchema = properties => {
      const deepProperties = pickBy(
        property => has('properties', property),
        properties,
      )
      const itemsProperties = pickBy(
        property => has('items', property),
        properties,
      )

      return {
        ...map(
          value => value.widget,
          pickBy(property => has('widget', property), properties),
        ),
        ...(deepProperties &&
          map(
            property => getDeepUiSchema(property.properties),
            deepProperties,
          )),
        ...(itemsProperties &&
          map(item => getDeepUiSchema(item), itemsProperties)),
      }
    }

    const uiSchema = {
      ...map(
        value => value.widget,
        pickBy(property => has('widget', property), componentSchema.properties),
      ),
      ...map(
        property => getDeepUiSchema(property.properties),
        pickBy(
          property => has('properties', property),
          componentSchema.properties,
        ),
      ),
    }

    return mergeDeepLeft(uiSchema, componentUiSchema || {})
  }

  private getDefaultConfiguration = (): ExtensionConfiguration => {
    const { runtime } = this.props

    return {
      allMatches: true,
      conditions: [],
      configurationId: 'new',
      device: runtime.device,
      propsJSON: '{}',
      routeId: runtime.page,
      scope: 'url',
      url: window.location.pathname,
    }
  }

  private getExtension = (): Extension => {
    const {
      editor: { editTreePath },
      runtime: { extensions },
    } = this.props
    const { component = null, configurationsIds = [], props = {} } =
      extensions[editTreePath as string] || {}

    return { component, configurationsIds, props: props || {} }
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
        configuration: newConfiguration,
        scope: newConfiguration.scope,
      },
      () => {
        runtime.updateExtension(editor.editTreePath!, {
          component: this.getExtension().component,
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
      this.setState({ isEditMode: false }, () => {
        if (configurations.length > 0) {
          this.handleConfigurationChange(configurations[0])
        }
      })
    }
  }

  private handleConfigurationCreation = () => {
    this.handleConfigurationOpen(this.getDefaultConfiguration())

    this.setState({ wasModified: true })
  }

  private handleConfigurationDefaultState = () => {
    const extensionConfigurationsQuery = this.props.extensionConfigurations
    const configurations = extensionConfigurationsQuery.extensionConfigurations
    if (
      !this.state.configuration &&
      !extensionConfigurationsQuery.loading &&
      !extensionConfigurationsQuery.error
    ) {
      if (configurations && configurations.length > 0) {
        this.handleConfigurationChange(configurations[0])
      } else {
        this.setState(
          {
            configuration: this.getDefaultConfiguration(),
            wasModified: true,
          },
          () => {
            this.handleConfigurationOpen(this.state.configuration!)
          },
        )
      }
    }
  }

  private handleConfigurationOpen = (configuration: ExtensionConfiguration) => {
    const { configuration: currConfiguration } = this.state

    if (
      currConfiguration &&
      currConfiguration.configurationId !== configuration.configurationId
    ) {
      this.handleConfigurationChange(configuration)
    }

    this.setState({ isEditMode: true })
  }

  private handleConfigurationSave = async (event: any) => {
    const { editor, runtime, saveExtension } = this.props
    const { conditions, configuration, scope } = this.state

    const { allMatches, device } = configuration!

    const configurationId =
      configuration!.configurationId === 'new'
        ? undefined
        : configuration!.configurationId

    const { component, props = {} } = this.getExtension()
    const isEmpty = this.isEmptyExtensionPoint(component)

    const componentImplementation = component && getImplementation(component)
    const pickedProps = isEmpty
      ? null
      : this.getSchemaProps(componentImplementation, props, runtime)

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
          path: window.location.pathname,
          propsJSON: isEmpty ? '{}' : JSON.stringify(pickedProps),
          routeId: runtime.page,
          scope,
        },
      })

      const extensionConfigurationsQuery = this.props.extensionConfigurations

      await extensionConfigurationsQuery.refetch({
        configurationsIds:
          runtime.extensions[editor.editTreePath as string].configurationsIds,
        routeId: runtime.page,
        treePath: editor.editTreePath,
        url: window.location.pathname,
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

  private handleDiscard = () => {
    this.setState({ wasModified: false }, () => {
      this.handleModalResolution()
    })
  }

  private handleFormChange = (event: any) => {
    const {
      runtime: { updateExtension, updateComponentAssets },
      runtime,
      editor: { editTreePath },
    } = this.props
    const { component: enumComponent } = event.formData
    const component =
      enumComponent && enumComponent !== '' ? enumComponent : null
    const Component = component && getImplementation(component)

    if (!this.state.wasModified) {
      this.setState({ wasModified: true })
    }

    if (component && !Component) {
      const allComponents = reduce(
        (acc, component) => {
          acc[component.name] = {
            assets: component.assets,
            dependencies: component.dependencies,
          }
          return acc
        },
        {},
        this.props.availableComponents.availableComponents,
      )

      updateComponentAssets(allComponents)
    }

    const props = this.getSchemaProps(Component, event.formData, runtime)

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
    const extensionConfigurationsQuery = this.props.extensionConfigurations
    const configurations = extensionConfigurationsQuery.extensionConfigurations

    this.handleModalClose()
    this.handleConfigurationClose()

    if (configurations.length === 0) {
      this.handleQuit()
    }
  }

  private handleModeSwitch = (newMode: ComponentEditorMode) => {
    if (newMode !== this.state.mode) {
      this.setState({ mode: newMode })
    }
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

  private handleScopeChange = (newScope: ConfigurationScope) => {
    if (newScope !== this.state.scope) {
      this.setState({ scope: newScope })
    }
  }

  private renderConfigurationCard(
    configuration: ExtensionConfiguration,
  ): JSX.Element {
    const { intl } = this.props

    const isActive =
      this.state.configuration &&
      configuration.configurationId === this.state.configuration.configurationId

    return (
      <div
        className="mh5 mt5 pointer"
        onClick={() => {
          this.handleConfigurationSelection(configuration)
        }}
      >
        <Card noPadding>
          <div className={`pa5 ${isActive ? 'bg-washed-blue' : ''}`}>
            <div className="mt5">
              <FormattedMessage id="pages.conditions.scope.title" />
              <Badge bgColor="#979899" color="#FFF">
                {intl.formatMessage({
                  id: `pages.conditions.scope.${configuration.scope}`,
                })}
              </Badge>
            </div>
            {configuration.conditions.length > 0 && (
              <div className="mt5">
                <FormattedMessage id="pages.editor.components.configurations.customConditions" />
                <div>{configuration.conditions.join(', ')}</div>
              </div>
            )}
            <div className="mt5">
              <Button
                onClick={() => {
                  this.handleConfigurationOpen(configuration)
                }}
                size="small"
                variation="tertiary"
              >
                {intl.formatMessage({
                  id: 'pages.editor.components.configurations.button.edit',
                })}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  private renderCreateConfigurationButton(): JSX.Element {
    return (
      <div className="mh5 mt5">
        <Button
          block
          onClick={this.handleConfigurationCreation}
          variation="tertiary"
        >
          {this.props.intl.formatMessage({
            id: 'pages.editor.components.configurations.button.create',
          })}
        </Button>
      </div>
    )
  }

  private renderConfigurationEditor(
    schema: object,
    uiSchema: object,
    extensionProps: object,
  ): JSX.Element {
    const { editor, runtime } = this.props
    const { configuration } = this.state

    const mobile = window.innerWidth < 600
    const animation = mobile ? 'slideInUp' : 'fadeIn'

    const props = configuration
      ? {
          ...(configuration.propsJSON && JSON.parse(configuration.propsJSON)),
          ...extensionProps,
        }
      : extensionProps

    return (
      <Fragment>
        <ConditionsSelector
          editor={editor}
          onChangeCustomConditions={this.handleConditionsChange}
          onChangeScope={this.handleScopeChange}
          runtime={runtime}
          scope={this.state.scope}
          selectedConditions={this.state.conditions}
        />
        <div
          className={`bg-white flex flex-column justify-between size-editor w-100 pb3 animated ${animation} ${
            this._isMounted ? '' : 'fadeIn'
          }`}
          style={{ animationDuration: '0.2s' }}
        >
          <ModeSwitcher
            activeMode={this.state.mode}
            modes={MODES}
            onSwitch={this.handleModeSwitch}
          />
          <Form
            schema={schema}
            formData={props}
            onChange={this.handleFormChange}
            onSubmit={this.handleConfigurationSave}
            FieldTemplate={FieldTemplate}
            ArrayFieldTemplate={ArrayFieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            uiSchema={uiSchema}
            widgets={widgets}
            showErrorList
            ErrorList={ErrorListTemplate}
            formContext={{ isLayoutMode: this.state.mode === 'layout' }}
          >
            <button className="dn" type="submit" />
          </Form>
          <div id="form__error-list-template___alert" />
        </div>
      </Fragment>
    )
  }

  private renderConfigurationsList(
    configurationsList: ExtensionConfiguration[],
  ): JSX.Element {
    return (
      <Fragment>
        {configurationsList.map(
          (configuration: ExtensionConfiguration, index: number) => (
            <Fragment key={index}>
              {this.renderConfigurationCard(configuration)}
            </Fragment>
          ),
        )}
        {this.renderCreateConfigurationButton()}
      </Fragment>
    )
  }

  private renderModal(): JSX.Element {
    return (
      <Modal
        centered
        isOpen={this.state.isModalOpen}
        onClose={this.handleModalClose}
      >
        <div>
          {this.props.intl.formatMessage({
            id: 'pages.editor.components.modal.text',
          })}
        </div>
        <div className="mt6 flex justify-end">
          <div className="mr3">
            <Button
              onClick={this.handleDiscard}
              size="small"
              variation="tertiary"
            >
              {this.props.intl.formatMessage({
                id: 'pages.editor.components.modal.button.discard',
              })}
            </Button>
          </div>
          <Button
            isLoading={this.state.isLoading}
            onClick={this.handleConfigurationSave}
            size="small"
            variation="primary"
          >
            {this.props.intl.formatMessage({
              id: 'pages.editor.components.button.save',
            })}
          </Button>
        </div>
      </Modal>
    )
  }

  private renderSaveButton(): JSX.Element {
    return (
      <Button
        isLoading={this.state.isLoading}
        onClick={this.handleConfigurationSave}
        size="small"
        variation="tertiary"
      >
        {this.props.intl.formatMessage({
          id: 'pages.editor.components.button.save',
        })}
      </Button>
    )
  }

  public render() {
    const extensionConfigurationsQuery = this.props.extensionConfigurations

    const { component, props } = this.getExtension()
    const Component = getImplementation(component)
    const editableComponents = this.props.availableComponents
      .availableComponents
      ? map(prop('name'), this.props.availableComponents.availableComponents)
      : []

    const selectedComponent = component || null

    const componentSchema = this.getComponentSchema(
      Component,
      props,
      this.props.runtime,
    )

    const componentUiSchema =
      Component && Component.uiSchema ? Component.uiSchema : null

    const maybeComponent = !selectedComponent
      ? {
          component: {
            enum: editableComponents,
            enumNames: editableComponents,
            title: 'Component',
            type: 'string',
            default: '',
          },
        }
      : null

    const schema = {
      ...componentSchema,
      title: undefined,
      properties: {
        ...maybeComponent,
        ...componentSchema.properties,
      },
    }

    const uiSchema = {
      ...defaultUiSchema,
      ...this.getUiSchema(componentUiSchema, componentSchema),
    }

    const extensionProps = {
      component: selectedComponent,
      ...props,
    }

    return (
      <div className="w-100 dark-gray">
        {this.renderModal()}
        <div className="w-100 flex items-center pl5 pv5 bt b--light-silver">
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
          <span className="ml5">
            <PathMinus size={16} color="#585959" />
          </span>
          <h4 className="w-100 f6 fw5 pl5 track-1 mv0 dark-gray">
            {this.state.isEditMode ? (
              <div className="flex justify-between items-center">
                {this.state.configuration!.conditions.join(', ') +
                  ' ' +
                  this.state.configuration!.scope}
                {this.state.wasModified && this.renderSaveButton()}
              </div>
            ) : (
              componentSchema.title
            )}
          </h4>
        </div>
        {extensionConfigurationsQuery.loading ? (
          <div className="mt5 flex justify-center">
            <Spinner />
          </div>
        ) : extensionConfigurationsQuery.extensionConfigurations &&
        extensionConfigurationsQuery.extensionConfigurations.length > 0 &&
        !this.state.isEditMode ? (
          this.renderConfigurationsList(
            extensionConfigurationsQuery.extensionConfigurations,
          )
        ) : (
          this.renderConfigurationEditor(schema, uiSchema, extensionProps)
        )}
      </div>
    )
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' }),
  graphql(AvailableComponents, {
    name: 'availableComponents',
    options: (props: ComponentEditorProps) => ({
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
      editor: { editTreePath },
      runtime: { extensions, page },
    }: ComponentEditorProps) => ({
      variables: {
        configurationsIds: extensions[editTreePath as string].configurationsIds,
        routeId: page,
        treePath: editTreePath,
        url: window.location.pathname,
      },
    }),
  }),
)(ComponentEditor)
