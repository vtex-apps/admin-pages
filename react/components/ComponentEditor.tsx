import PropTypes from 'prop-types'
import { filter, find, has, keys, map, merge, pick, pickBy, prop, reduce } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import Form from 'react-jsonschema-form'
import { Button, Spinner } from 'vtex.styleguide'

import AvailableComponents from '../queries/AvailableComponents.graphql'
import SaveExtension from '../queries/SaveExtension.graphql'
import { getImplementation } from '../utils/components'

import ArrayFieldTemplate from './form/ArrayFieldTemplate'
import BaseInput from './form/BaseInput'
import Dropdown from './form/Dropdown'
import ErrorListTemplate from './form/ErrorListTemplate'
import FieldTemplate from './form/FieldTemplate'
import ImageUploader from './form/ImageUploader'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'
import Radio from './form/Radio'
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
  'image-uploader': ImageUploader,
}

const MODES  = ['content', 'layout']

type ComponentEditorMode = 'content' | 'layout'

interface ComponentEditorProps {
  availableComponents: any
  saveExtension: any
}

interface ComponentEditorState {
  loading: boolean
  mode: ComponentEditorMode
}

class ComponentEditor extends Component<ComponentEditorProps & RenderContextProps & EditorContextProps, ComponentEditorState> {
  public static propTypes = {
    availableComponents: PropTypes.object,
    intl: intlShape.isRequired,
    saveExtension: PropTypes.any,
  }

  // tslint:disable-next-line
  private _isMounted: boolean = false
  private old: string

  constructor(props: any) {
    super(props)

    this.state = {
      loading: false,
      mode: 'content',
    }

    const {component, props: extensionProps} = this.getExtension()

    this.old = JSON.stringify({
      component,
      props: this.getSchemaProps(getImplementation(component), extensionProps),
    })
  }

  public componentDidMount() {
    this._isMounted = true
  }

  public componentWillUnmount() {
    this._isMounted = false
  }

  public getSchemaProps = (component, props) => {
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

    const componentSchema = this.getComponentSchema(component, props)

    return getPropsFromSchema(componentSchema.properties, props)
  }

  public handleFormChange = (event: any) => {
    const { runtime: { updateExtension }, editor: { editTreePath } } = this.props
    const { component: enumComponent } = event.formData
    const component = enumComponent && enumComponent !== '' ? enumComponent : null
    const Component = component && getImplementation(component)

    if (component && !Component) {
      const available = find((c) => c.name === component, this.props.availableComponents.availableComponents)
      // TODO add updateComponentAssets in runtime context and call that
      global.__RUNTIME__.components[component] = available
    }

    const props = this.getSchemaProps(Component, event.formData)
    console.log('Updating extension with props', props)

    updateExtension(editTreePath as string, {
      component,
      props,
    })
  }

  public handleSave = (event: any) => {
    console.log('save', event, this.props)
    const { saveExtension, editor: { activeConditions, anyMatch, editTreePath, editExtensionPoint, scope, device }, runtime: {page} } = this.props
    const { component, props = {} } = this.getExtension()
    const isEmpty = this.isEmptyExtensionPoint(component)

    const componentImplementation = component && getImplementation(component)
    const pickedProps = isEmpty ? null : this.getSchemaProps(componentImplementation, props)

    const selectedComponent = isEmpty ? null : component

    this.setState({
      loading: true,
    })

    saveExtension({
      variables: {
        anyMatch,
        component: selectedComponent,
        conditions: activeConditions,
        device,
        extensionName: editTreePath,
        path: window.location.pathname,
        propsJSON: isEmpty ? '{}' : JSON.stringify(pickedProps),
        routeId: page,
        scope,
        template: null,
      },
    })
      .then((data) => {
        console.log('OK!', data)
        this.setState({
          loading: false,
        })
        editExtensionPoint(null)
      })
      .catch(err => {
        this.setState({
          loading: false,
        })
        alert('Error loading extension point configuration.')
        console.log(err)
        this.handleCancel()
      })
  }

  public handleCancel = (event?: any) => {
    console.log('Updating extension with saved information', this.old)
    const { editor: { editExtensionPoint, editTreePath }, runtime: { updateExtension }} = this.props
    updateExtension(editTreePath as string, JSON.parse(this.old))
    editExtensionPoint(null)
    delete this.old
    if (event) {
      event.stopPropagation()
    }
  }

  public handleModeSwitch = (newMode: ComponentEditorMode) => {
    if (newMode !== this.state.mode) {
      this.setState({ mode: newMode })
    }
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
  public getComponentSchema = (component, props) => {
    const componentSchema = component && (component.schema || (component.getSchema && component.getSchema(props))) || {
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
      const translate: (value: string | {id: string, values: object}) => string =
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
      return {
        ...map(value => value.widget, pickBy(property => has('widget', property), properties)),
        ...deepProperties && map(property => getDeepUiSchema(property.properties), deepProperties),
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

    return {
      ...uiSchema,
      ...componentUiSchema,
    }
  }

  public render() {
    const { component, props } = this.getExtension()
    const Component = getImplementation(component)
    const editableComponents = this.props.availableComponents.availableComponents
      ? map(prop('name'), this.props.availableComponents.availableComponents)
      : []

    const selectedComponent = this.isEmptyExtensionPoint(component) ? undefined : component

    const componentSchema = this.getComponentSchema(Component, props)

    const componentUiSchema = Component && Component.uiSchema ? Component.uiSchema : null

    const displayName = componentSchema.component || componentSchema.title

    const mobile = window.innerWidth < 600
    const animation = mobile ? 'slideInUp' : 'fadeIn'

    const schema = {
      ...componentSchema,
      title: undefined,
      properties: {
        component: {
          enum: editableComponents,
          enumNames: editableComponents,
          title: 'Component',
          type: 'string',
          default: '',
        },
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
      <div className="w-100 near-black">
        <h3 className="pa4"><FormattedMessage id="pages.editor.components.title"/></h3>
        <div className={`bg-white flex flex-column size-editor w-100 animated ${animation} ${this._isMounted ? '' : 'fadeIn'}`} style={{ animationDuration: '0.2s' }} >
          <div id="form__error-list-template___alert" />
          <ModeSwitcher
            activeMode={this.state.mode}
            modes={MODES}
            onSwitch={this.handleModeSwitch}
          />
          <div>
            <Form
              schema={schema}
              formData={extensionProps}
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
          </div>
          <div className="w-100 flex flex-none bt bw2 b--light-silver">
            <div className="w-50 flex items-center justify-center bg-near-white hover-bg-light-silver hover-heavy-blue br bw2 b--light-silver">
              <Button
                block
                onClick={this.handleCancel}
                size="regular"
                variation="tertiary"
              >
                Cancel
              </Button>
            </div>
            <div className="w-50 flex items-center justify-center bg-near-white hover-bg-light-silver hover-heavy-blue">
              {this.state.loading ? (
                <Spinner size={28} />
              ) : (
                <Button block onClick={this.handleSave} size="regular" variation="tertiary">
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
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
)(ComponentEditor)
