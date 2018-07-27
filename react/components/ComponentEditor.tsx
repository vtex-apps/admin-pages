import PropTypes from 'prop-types'
import { filter, has, keys, map, merge, pick, pickBy, prop, reduce, mergeDeepLeft } from 'ramda'
import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import Form from 'react-jsonschema-form'
import { Button, Modal, IconArrowBack, Spinner } from 'vtex.styleguide'

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
  'classNames': 'editor-form',
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
}

interface ComponentEditorProps {
  availableComponents: any
  extensionConfigurations: ExtensionConfigurationsQuery
  intl: ReactIntl.InjectedIntl
  saveExtension: any
}

interface ComponentEditorState {
  conditions: string[]
  configuration?: ExtensionConfiguration
  configurationAfterModal?: ExtensionConfiguration
  isLoading: boolean
  isModalOpen: boolean
  mode: ComponentEditorMode
  scope: ConfigurationScope
  wasModified: boolean
}

class ComponentEditor extends Component<ComponentEditorProps & RenderContextProps & EditorContextProps, ComponentEditorState> {
  public static propTypes = {
    availableComponents: PropTypes.object,
    intl: intlShape.isRequired,
    saveExtension: PropTypes.any,
  }

  // tslint:disable-next-line
  private _isMounted: boolean = false

  private initialProps: object

  constructor(props: any) {
    super(props)

    this.initialProps = {}

    this.state = {
      conditions: [],
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
            [key]: properties[key].type === 'object'
              ? getPropsFromSchema(properties[key].properties, prevProps[key])
              : prevProps[key],
          }),
        {},
        filter(v => prevProps[v] !== undefined, keys(properties))
      )

    const componentSchema = this.getComponentSchema(component, props, runtime)

    return getPropsFromSchema(componentSchema.properties, props)
  }

  public isEmptyExtensionPoint = (component) =>
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
    const componentSchema =
      component && (component.schema || (component.getSchema && component.getSchema(props, { routes: runtime.pages }))) || {
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
      const translate: (value: string | { id: string, values: object }) => string =
        value => typeof value === 'string'
          ? this.props.intl.formatMessage({ id: value })
          : this.props.intl.formatMessage({ id: value.id }, value.values || {})

      const translatedSchema = map(
        value => Array.isArray(value) ? map(translate, value) : translate(value),
        pick(['title', 'description', 'enumNames'], schema)
      )

      if (has('widget', schema)) {
        translatedSchema.widget = merge(
          schema.widget,
          map(
            translate,
            pick(['ui:help', 'ui:title', 'ui:description', 'ui:placeholder'], schema.widget)
          )
        )
      }

      if (schema.type === 'object') {
        translatedSchema.properties = reduce(
          (properties, key) => merge(properties, { [key]: traverseAndTranslate(schema.properties[key]) }),
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
      const deepProperties = pickBy(property => has('properties', property), properties)
      const itemsProperties = pickBy(property => has('items', property), properties)

      return {
        ...map(value => value.widget, pickBy(property => has('widget', property), properties)),
        ...deepProperties && map(property => getDeepUiSchema(property.properties), deepProperties),
        ...itemsProperties && map(item => getDeepUiSchema(item), itemsProperties),
      }
    }

    const uiSchema = {
      ...map(value => value.widget, pickBy(
        property => has('widget', property), componentSchema.properties
      )),
      ...map(property => getDeepUiSchema(property.properties), pickBy(
        property => has('properties', property), componentSchema.properties
      )),
    }

    return mergeDeepLeft(uiSchema, componentUiSchema || {})
  }

  private handleConditionsChange = (newConditions: string[]) => {
    this.setState({ conditions: newConditions })
  }

  private handleConfigurationChange(newConfiguration: ExtensionConfiguration) {
    const { editor, runtime } = this.props

    this.setState({
      conditions: newConfiguration.conditions,
      configuration: newConfiguration,
      scope: newConfiguration.scope,
    }, () => {
      runtime.updateExtension(
        editor.editTreePath!,
        {
          component: this.getExtension().component,
          props: JSON.parse(newConfiguration.propsJSON),
        }
      )
    })
  }

  private handleConfigurationDefaultState() {
    const { runtime } = this.props

    const extensionConfigurationsQuery = this.props.extensionConfigurations
    const configurations = extensionConfigurationsQuery.extensionConfigurations

    if (
      !this.state.configuration &&
      !extensionConfigurationsQuery.loading &&
      !extensionConfigurationsQuery.error
    ) {
      if (configurations && configurations.length > 0) {
        this.setState({
          conditions: configurations[0].conditions,
          configuration: configurations[0],
          scope: configurations[0].scope,
        })
      } else {
        this.setState({
          configuration: {
            allMatches: true,
            conditions: [],
            configurationId: 'new',
            device: runtime.device,
            propsJSON: '{}',
            routeId: runtime.page,
            scope: 'url',
          }
        })
      }
    }
  }

  private handleConfigurationSelection(newConfiguration?: ExtensionConfiguration) {
    if (
      newConfiguration &&
      newConfiguration.configurationId !== this.state.configuration!.configurationId
    ) {
      if (this.state.wasModified) {
        this.setState({
          configurationAfterModal: newConfiguration
        }, () => {
          this.handleModalOpen()
        })
      } else {
        this.handleConfigurationChange(newConfiguration)
      }
    }
  }

  private handleDiscard = () => {
    this.setState({ wasModified: false }, () => {
      this.handleModalResolution()
    })
  }

  private handleExit = (event?: any) => {
    const { editor, runtime } = this.props

    const extensionConfigurationsQuery = this.props.extensionConfigurations
    const configurations = extensionConfigurationsQuery.extensionConfigurations

    const props =
      configurations && configurations.length > 0
        ? JSON.parse(configurations[0].propsJSON)
        : this.getExtension().props

    if (event) {
      event.stopPropagation()
    }

    if (this.state.wasModified) {
      this.handleModalOpen()
    } else {
      runtime.updateExtension(
        editor.editTreePath!,
        {
          component: this.getExtension().component,
          props,
        }
      )

      editor.editExtensionPoint(null)
    }
  }

  private handleFormChange = (event: any) => {
    const { runtime: { updateExtension, updateComponentAssets }, runtime, editor: { editTreePath } } = this.props
    const { component: enumComponent } = event.formData
    const component = enumComponent && enumComponent !== '' ? enumComponent : null
    const Component = component && getImplementation(component)

    if (!this.state.wasModified) {
      this.setState({ wasModified: true })
    }

    if (component && !Component) {
      const allComponents = reduce((acc, component) => {
        acc[component.name] = {
          assets: component.assets,
          dependencies: component.dependencies
        }
        return acc
      }, {}, this.props.availableComponents.availableComponents)

      updateComponentAssets(allComponents)
    }

    const props = this.getSchemaProps(Component, event.formData, runtime)
    console.log('Updating extension with props', props)

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

    if (this.state.configurationAfterModal) {
      this.handleConfigurationChange(this.state.configurationAfterModal)
      this.setState({ configurationAfterModal: undefined })
    }
  }

  private handleModeSwitch = (newMode: ComponentEditorMode) => {
    if (newMode !== this.state.mode) {
      this.setState({ mode: newMode })
    }
  }

  private handleSave = (event: any) => {
    console.log('save', event, this.props)
    const {
      editor: { editTreePath },
      runtime,
      saveExtension,
    } = this.props
    const { conditions, configuration, scope } = this.state

    const { allMatches, device } = configuration!

    const configurationId =
      configuration!.configurationId === 'new'
        ? undefined
        : configuration!.configurationId

    const { component, props = {} } = this.getExtension()
    const isEmpty = this.isEmptyExtensionPoint(component)

    const componentImplementation = component && getImplementation(component)
    const pickedProps = isEmpty ? null : this.getSchemaProps(componentImplementation, props, runtime)

    this.setState({
      isLoading: true,
    })

    saveExtension({
      refetchQueries: [
        {
          query: ExtensionConfigurations,
          variables: {
            treePath: editTreePath,
          }
        }
      ],
      variables: {
        allMatches,
        conditions,
        configurationId,
        device,
        extensionName: editTreePath,
        path: window.location.pathname,
        propsJSON: isEmpty ? '{}' : JSON.stringify(pickedProps),
        routeId: runtime.page,
        scope,
      },
    })
    .then(data => {
        console.log('OK!', data)

        this.setState({
          isLoading: false,
          wasModified: false,
        }, () => {
          if (this.state.isModalOpen) {
            this.handleModalResolution()
          }
        })
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        }, () => {
          if (this.state.isModalOpen) {
            this.handleModalClose()
          }
        })

        alert('Error loading extension point configuration.')

        console.log(err)
      })
  }

  private handleScopeChange = (newScope: ConfigurationScope) => {
    if (newScope !== this.state.scope) {
      this.setState({ scope: newScope })
    }
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
            id: 'pages.editor.components.modal.text'
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
                id: 'pages.editor.components.modal.button.discard'
              })}
            </Button>
          </div>
          <Button
            isLoading={this.state.isLoading}
            onClick={this.handleSave}
            size="small"
            variation="primary"
          >
            {this.props.intl.formatMessage({
              id: 'pages.editor.components.button.save'
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
        onClick={this.handleSave}
        size="small"
        variation="tertiary"
      >
        {this.props.intl.formatMessage({
          id: 'pages.editor.components.button.save'
        })}
      </Button>
    )
  }

  private renderConfigurationSection(
    schema: object,
    uiSchema: object,
    extensionProps: object,
    configuration?: ExtensionConfiguration,
    index?: number
  ): JSX.Element {
    const { editor, runtime } = this.props

    const mobile = window.innerWidth < 600
    const animation = mobile ? 'slideInUp' : 'fadeIn'

    const props = configuration
      ? {
        ...configuration.propsJSON && JSON.parse(configuration.propsJSON),
        ...extensionProps,
      }
      : extensionProps

    const isExpanded =
      this.state.configuration && (
        configuration
          ? configuration.configurationId === this.state.configuration.configurationId
          : this.state.configuration.configurationId === 'new'
      )

    return (
      <Fragment>
        <div
          className={`w-100 pl5 flex justify-between items-center pointer bt b--light-silver ${isExpanded ? ' bg-light-silver' : 'gray'}`}
          onClick={() => { this.handleConfigurationSelection(configuration) }}
          style={{ height: '48px' }}
        >
          {`Configuration ${(index || 0) + 1}`}
          {isExpanded && this.state.wasModified && this.renderSaveButton()}
        </div>
        {isExpanded && (
          <div className="mt5">
            <ConditionsSelector
              editor={editor}
              onChangeCustomConditions={this.handleConditionsChange}
              onChangeScope={this.handleScopeChange}
              runtime={runtime}
              scope={this.state.scope}
              selectedConditions={this.state.conditions}
            />
            <div className={`bg-white flex flex-column justify-between size-editor w-100 pb3 animated ${animation} ${this._isMounted ? '' : 'fadeIn'}`} style={{ animationDuration: '0.2s' }}>
              <ModeSwitcher
                activeMode={this.state.mode}
                modes={MODES}
                onSwitch={this.handleModeSwitch}
              />
              <Form
                schema={schema}
                formData={props}
                onChange={this.handleFormChange}
                onSubmit={this.handleSave}
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
          </div>
        )}
      </Fragment>
    )
  }

  public render() {
    const extensionConfigurationsQuery = this.props.extensionConfigurations

    const { component, props } = this.getExtension()
    const Component = getImplementation(component)
    const editableComponents = this.props.availableComponents.availableComponents
      ? map(prop('name'), this.props.availableComponents.availableComponents)
      : []

    const selectedComponent = component || null

    const componentSchema = this.getComponentSchema(Component, props, this.props.runtime)

    const componentUiSchema = Component && Component.uiSchema ? Component.uiSchema : null

    const maybeComponent = !selectedComponent ? {
      component: {
        enum: editableComponents,
        enumNames: editableComponents,
        title: 'Component',
        type: 'string',
        default: '',
      },
    } : null

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
        <div className="flex items-center pl5 pv5 bt b--light-silver">
          <span className="pointer" onClick={this.handleExit}>
            <IconArrowBack size={16} color="#585959" />
          </span>
          <span className="ml5">
            <PathMinus size={16} color="#585959" />
          </span>
          <h4 className="f6 fw5 pl5 track-1 ttu mv0 dark-gray">
            {componentSchema.title}
          </h4>
        </div>
        {extensionConfigurationsQuery.loading
          ? (
            <div className="mt5 flex justify-center">
              <Spinner />
            </div>
          )
          : extensionConfigurationsQuery.extensionConfigurations &&
            extensionConfigurationsQuery.extensionConfigurations.length > 0
            ? extensionConfigurationsQuery.extensionConfigurations.map(
              (configuration: ExtensionConfiguration, index: number) => (
                <Fragment key={index}>
                  {this.renderConfigurationSection(
                    schema,
                    uiSchema,
                    extensionProps,
                    configuration,
                    index
                  )}
                </Fragment>
              )
            )
            : this.renderConfigurationSection(
              schema,
              uiSchema,
              extensionProps
            )
        }
      </div>
    )
  }

  private getExtension = (): Extension => {
    const { editor: { editTreePath }, runtime: { extensions } } = this.props
    const { component = null, props = {} } = extensions[editTreePath as string] || {}
    return { component, props: props || {} }
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' }),
  graphql(AvailableComponents, {
    name: 'availableComponents',
    options: (props: ComponentEditorProps & RenderContextProps & EditorContextProps) => ({
      variables: {
        extensionName: props.editor.editTreePath,
        production: false,
        renderMajor: 7,
      },
    }),
  }),
  graphql(ExtensionConfigurations, {
    name: 'extensionConfigurations',
    options: ({ editor: { editTreePath } }: EditorContextProps) => ({
      variables: {
        treePath: editTreePath,
      }
    })
  })
)(ComponentEditor)
