import PropTypes from 'prop-types'
import { has, find, map, prop, pick, pickBy, reduce, filter, keys, merge } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { createPortal } from 'react-dom'
import Draggable from 'react-draggable'
import { injectIntl, intlShape } from 'react-intl'
import Form from 'react-jsonschema-form'
import { Button, Spinner } from 'vtex.styleguide'

import BaseInput from '../form/BaseInput'
import Dropdown from '../form/Dropdown'
import ErrorListTemplate from '../form/ErrorListTemplate'
import FieldTemplate from '../form/FieldTemplate'
import ObjectFieldTemplate from '../form/ObjectFieldTemplate'
import Radio from '../form/Radio'
import Toggle from '../form/Toggle'
import CloseIcon from '../../images/CloseIcon.js'
import AvailableComponents from '../../queries/AvailableComponents.graphql'
import SaveExtension from '../../queries/SaveExtension.graphql'
import { getImplementation } from '../../utils/components'



const defaultUiSchema = {
  'classNames': 'editor-form',
}

const widgets = {
  BaseInput,
  CheckboxWidget: Toggle,
  RadioWidget: Radio,
  SelectWidget: Dropdown,
}

class ComponentEditor extends Component {
  static propTypes = {
    availableComponents: PropTypes.object,
    saveExtension: PropTypes.any,
    treePath: PropTypes.string,
    component: PropTypes.string,
    intl: intlShape.isRequired,
    props: PropTypes.object,
  }

  static contextTypes = {
    editExtensionPoint: PropTypes.func,
    updateExtension: PropTypes.func,
    emitter: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      saving: false,
    }

    this.old = JSON.stringify({
      component: props.component,
      props: this.getSchemaProps(getImplementation(props.component), props.props),
    })
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getSchemaProps = (component, props) => {
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

  handleFormChange = (event) => {
    const { component: enumComponent } = event.formData
    const component = enumComponent && enumComponent !== '' ? enumComponent : null
    const Component = component && getImplementation(component)

    if (component && !Component) {
      const available = find((c) => c.name === component, this.props.availableComponents.availableComponents)
      // TODO add updateComponentAssets in runtime context and call that
      global.__RUNTIME__.components[component] = available.assets
    }

    const props = this.getSchemaProps(Component, event.formData)
    console.log('Updating extension with props', props)

    this.context.updateExtension(this.props.treePath, {
      component,
      props,
    })
  }

  handleSave = (event) => {
    console.log('save', event, this.props)
    const { saveExtension, component, props } = this.props
    const isEmpty = this.isEmptyExtensionPoint(component)

    const componentImplementation = component && getImplementation(component)
    const pickedProps = isEmpty ? null : this.getSchemaProps(componentImplementation, props)

    const selectedComponent = isEmpty ? null : component

    this.setState({
      saving: true,
    })

    saveExtension({
      variables: {
        extensionName: this.props.treePath,
        component: selectedComponent,
        props: isEmpty ? null : JSON.stringify(pickedProps),
      },
    })
      .then((data) => {
        console.log('OK!', data)
        this.setState({
          saving: false,
        })
        this.context.editExtensionPoint(null)
      })
      .catch(err => {
        this.setState({
          saving: false,
        })
        alert('Error saving extension point configuration.')
        console.log(err)
        this.handleCancel()
      })
  }

  handleCancel = (event) => {
    console.log('Updating extension with saved information', this.old)
    this.context.updateExtension(this.props.treePath, JSON.parse(this.old))
    this.context.editExtensionPoint(null)
    delete this.old
    event && event.stopPropagation()
  }

  isEmptyExtensionPoint = (component) =>
    /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(component)

  /**
   * It receives a component implementation and decide which type of schema
   * will use, a static (schema) or a dynamic (getSchema) schema.
   * If none, returns a JSON specifying a simple static schema.
   *
   * @param {object} component The component implementation
   * @param {object} props The component props to be passed to the getSchema
   */
  getComponentSchema = (component, props) => {
    const schema = component && (component.schema || (component.getSchema && component.getSchema(props))) || {
      type: 'object',
      properties: {},
    }

    /**
     * Traverse the schema properties searching for the title, description and enum
     * properties and translate their value using the messages from the intl context
     *
     * @param {object} schema Schema to be translated
     * @return {object} Schema with title, description and enumNames properties translated
     */
    const traverseAndTranslate = schema => {
      const translate = value => typeof value === 'string'
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

      return merge(schema, translatedSchema)
    }

    return traverseAndTranslate(schema)
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
  getUiSchema = (componentUiSchema, componentSchema) => {
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

  render() {
    const { component, props } = this.props
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

    const editor = (
      <div className="w-100 near-black">
        <Draggable handle=".draggable">
          <div className={`br2-ns fixed z-max bg-white flex flex-column shadow-editor-desktop size-editor w-100 top-2-ns right-2-ns mt9-ns mh5-ns move animated ${animation} ${this._isMounted ? '' : 'fadeIn'}`} style={{ animationDuration: '0.2s' }} >
            <div className="flex flex-none justify-between bg-serious-black white fw7 f4 ph6 pv5 lh-copy w-100 br2-ns br--top-ns draggable z-max">
              <div>
                {displayName}
              </div>
              <button onClick={this.handleCancel} className="flex items-center pointer dim bg-transparent bn">
                <CloseIcon />
              </button>
            </div>
            <div id="form__error-list-template___alert" />
            <div className="flex-auto overflow-y-scroll form-schema">
              <Form
                schema={schema}
                formData={extensionProps}
                onChange={this.handleFormChange}
                onSubmit={this.handleSave}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                uiSchema={uiSchema}
                widgets={widgets}
                showErrorList={true}
                ErrorList={ErrorListTemplate}
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
                {this.state.saving ? (
                  <Spinner size={28} />
                ) : (
                  <Button block onClick={this.handleSave} size="regular" variation="tertiary">
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Draggable>
      </div>
    )

    return createPortal(editor, document.body)
  }
}

export default compose(
  injectIntl,
  graphql(SaveExtension, { name: 'saveExtension' }),
  graphql(AvailableComponents, {
    name: 'availableComponents',
    options: (props) => ({
      variables: {
        extensionName: props.treePath,
        renderMajor: 7,
        production: false,
      },
    }),
  }),
)(ComponentEditor)
