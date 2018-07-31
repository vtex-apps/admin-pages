import {
  filter,
  has,
  keys,
  map,
  merge,
  mergeDeepLeft,
  pick,
  pickBy,
  prop,
  reduce,
} from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import Form from 'react-jsonschema-form'
import { IconArrowBack, Spinner } from 'vtex.styleguide'

import AvailableComponents from '../../queries/AvailableComponents.graphql'
import ExtensionConfigurations from '../../queries/ExtensionConfigurations.graphql'
import SaveExtension from '../../queries/SaveExtension.graphql'
import { getImplementation } from '../../utils/components'
import ConditionsSelector from '../ConditionsSelector'
import ArrayFieldTemplate from '../form/ArrayFieldTemplate'
import BaseInput from '../form/BaseInput'
import Dropdown from '../form/Dropdown'
import ErrorListTemplate from '../form/ErrorListTemplate'
import FieldTemplate from '../form/FieldTemplate'
import ImageUploader from '../form/ImageUploader'
import ObjectFieldTemplate from '../form/ObjectFieldTemplate'
import Radio from '../form/Radio'
import TextArea from '../form/TextArea'
import Toggle from '../form/Toggle'
import ModeSwitcher from '../ModeSwitcher'

import ConfigurationsList from './ConfigurationsList'
import LabelEditor from './LabelEditor'
import Modal from './Modal'
import SaveButton from './SaveButton'

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

const MODES: ComponentEditorMode[] = ['content', 'layout']

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
  configuration?: AdaptedExtensionConfiguration
  isEditMode: boolean
  isLoading: boolean
  isModalOpen: boolean
  mode: ComponentEditorMode
  newLabel?: string
  wasModified: boolean
}

class ComponentEditor extends Component<
  ComponentEditorProps,
  ComponentEditorState
> {
  // tslint:disable-next-line
  private _isMounted: boolean = false

  constructor(props: ComponentEditorProps) {
    super(props)

    this.state = {
      conditions: [],
      isEditMode: false,
      isLoading: false,
      isModalOpen: false,
      mode: 'content',
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

  public render() {
    const extensionConfigurationsQuery = this.props.extensionConfigurations

    const { component, props } = this.getExtension()
    const componentImplementation = getImplementation(component)

    const selectedComponent = component || null

    const componentSchema = this.getComponentSchema(
      componentImplementation,
      props,
      this.props.runtime,
    )

    const componentUiSchema =
      componentImplementation && componentImplementation.uiSchema
        ? componentImplementation.uiSchema
        : null

    const schema = {
      ...componentSchema,
      properties: {
        ...componentSchema.properties,
      },
      title: undefined,
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
        <Modal
          isOpen={this.state.isModalOpen}
          isSaveLoading={this.state.isLoading}
          onClickDiscard={this.handleConfigurationDiscard}
          onClickSave={this.handleConfigurationSave}
          onClose={this.handleModalClose}
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
            <h4 className="mv0 f6 fw5 dark-gray">{componentSchema.title}</h4>
            {this.state.isEditMode &&
              this.state.wasModified && (
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
          <ConfigurationsList
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
            onCreate={this.handleConfigurationCreation}
            onEdit={this.handleConfigurationOpen}
            onSelect={this.handleConfigurationSelection}
          />
        ) : (
          this.renderConfigurationEditor(schema, uiSchema, extensionProps)
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
      this.setState({ isEditMode: false, newLabel: undefined }, () => {
        if (configurations.length > 0) {
          this.handleConfigurationChange(configurations[0])
        } else {
          this.handleQuit()
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
        this.handleConfigurationOpen(this.getDefaultConfiguration())
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
    const { editor, runtime, saveExtension } = this.props
    const { conditions, configuration } = this.state

    const { allMatches, device } = configuration!

    const configurationId =
      configuration!.configurationId === 'new'
        ? undefined
        : configuration!.configurationId

    const { component, props = {} } = this.getExtension()

    const componentImplementation = component && getImplementation(component)
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
          label: this.state.newLabel || configuration!.label,
          path: window.location.pathname,
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

  private handleFormChange = (event: any) => {
    const {
      runtime: { updateExtension, updateComponentAssets },
      runtime,
      editor: { editTreePath },
    } = this.props
    const { component: enumComponent } = event.formData
    const component =
      enumComponent && enumComponent !== '' ? enumComponent : null
    const componentImplementation = component && getImplementation(component)

    if (!this.state.wasModified) {
      this.setState({ wasModified: true })
    }

    if (component && !componentImplementation) {
      const allComponents = reduce(
        (acc, currComponent) => {
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
    if (
      this.state.configuration &&
      newScope !== this.state.configuration.scope
    ) {
      this.setState(prevState => ({
        ...prevState,
        configuration: { ...prevState.configuration!, scope: newScope },
        wasModified: true,
      }))
    }
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
        <div className="ph5 mt5">
          <LabelEditor
            onChange={this.handleConfigurationLabelChange}
            value={
              this.state.newLabel || (configuration && configuration.label)
            }
          />
          <div className="mt5">
            <ConditionsSelector
              editor={editor}
              onCustomConditionsChange={this.handleConditionsChange}
              onScopeChange={this.handleScopeChange}
              runtime={runtime}
              scope={configuration && configuration.scope}
              selectedConditions={this.state.conditions}
            />
          </div>
        </div>
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
