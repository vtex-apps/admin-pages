import Button from '@vtex/styleguide/lib/Button'
import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { compose, graphql } from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'
import { has, hasIn, filter, find, pick, map, prop, pickBy } from 'ramda'

import SaveExtension from '../queries/SaveExtension.graphql'
import AvailableComponents from '../queries/AvailableComponents.graphql'
import { getImplementation } from '../utils/components'

import BaseInput from './form/BaseInput'
import FieldTemplate from './form/FieldTemplate'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'

import Draggable from 'react-draggable'
import CloseIcon from '../images/CloseIcon.js'

import Spinner from '@vtex/styleguide/lib/Spinner'

const defaultUiSchema = {
  'classNames': 'editor-form',
}

const widgets = {
  BaseInput,
}

let openInstance = null

class ComponentEditor extends Component {
  static propTypes = {
    availableComponents: PropTypes.object,
    saveExtension: PropTypes.any,
    treePath: PropTypes.string,
    component: PropTypes.string,
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

    const componentSchema = this.getComponentSchema(component, props)
    const propsToSave = Object.keys(componentSchema.properties)
    return pick(propsToSave, props)
  }

  handleFormChange = (event) => {
    console.log('Updating extension with formData...', event.formData)
    const { component: enumComponent } = event.formData
    const component = enumComponent && enumComponent !== '' ? enumComponent : null
    const Component = component && getImplementation(component)

    if (component && !Component) {
      const available = find((c) => c.name === component, this.props.availableComponents.availableComponents)
      // TODO add updateComponentAssets in runtime context and call that
      global.__RUNTIME__.components[component] = available.assets
    }

    this.context.updateExtension(this.props.treePath, {
      component,
      props: this.getSchemaProps(Component, event.formData),
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
        openInstance = null
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
    openInstance = null
  }

  isEmptyExtensionPoint = (component) =>
    /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(component)

  /**
   * It receives a component implementation and decide which type of schema
   * will use, an static (schema) or a dynamic (getSchema) schema.
   * If none, returns a JSON specifying a simple static schema.
   *
   * @component The component implementation
   * @props The react props to be passed to the getSchema, if it's the case
   */
  getComponentSchema = (component, props) => {
    return component && (component.schema || (component.getSchema && component.getSchema(props))) || {
      type: 'object',
      properties: {},
    }
  }

  getInnerWidgets = properties => {
    const extractWidget = properties => {
      const deepProperties = pickBy(property => has('properties', property), properties)
      return {
        ...map((value, key) => value.widget, pickBy(property => has('widget', property), properties)),
        ...deepProperties && map(property => extractWidget(property.properties),deepProperties)
      }
    }

    return {
      ...map((value, key) => value.widget, pickBy(property => has('widget',property), properties)),
      ...map(property => extractWidget(property.properties), pickBy(property => has('properties', property), properties))
    }
  }

  getUiSchema = (componentUiSchema, componentSchema) => {
    return {
      ...this.getInnerWidgets(componentSchema.properties),
      ...componentUiSchema
    }
  }

  render() {
    if (openInstance && openInstance !== this) {
      console.log('another open instance', this)
      return null
    }
    openInstance = this

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

    // console.log(uiSchema)

    const extensionProps = {
      component: selectedComponent,
      ...props,
    }

    const editor = (
      <div className="w-100 near-black">
        <Draggable handle=".draggable">
          <div className={`br2-ns fixed z-max bg-white shadow-editor-desktop size-editor w-100 top-2-ns right-2-ns mt9-ns mh5-ns move animated ${animation} ${this._isMounted ? '' : 'fadeIn'}`} style={{ animationDuration: '0.2s' }}>
            <div className="bg-serious-black white fw7 f4 ph6 pv5 lh-copy w-100 fixed flex justify-between br2-ns br--top-ns draggable">
              <div>
                {displayName}
              </div>
              <div onClick={this.handleCancel} className="flex items-center pointer dim">
                <CloseIcon />
              </div>
            </div>
            <div className="overflow-scroll form-schema">
              <Form
                schema={schema}
                formData={extensionProps}
                onChange={this.handleFormChange}
                onSubmit={this.handleSave}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                uiSchema={uiSchema}
                widgets={widgets}>
                <div className="flex fixed bottom-0 w-100 bt bw2 b--light-silver">
                  <div className="w-50 tc br b--light-silver bw2 h-100 bg-near-white pointer hover-bg-light-silver hover-heavy-blue lh-copy">
                    <Button block size="large" onClick={this.handleCancel}>
                      Cancel
                    </Button>
                  </div>
                  <div className="w-50 tc bg-near-white hover-bg-light-silver pointer hover-heavy-blue flex items-center justify-center">
                    {this.state.saving ? (
                      <Spinner size={28} />
                    ) : (
                      <Button block size="large" type="submit">
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Draggable>
      </div>
    )

    return createPortal(editor, document.body)
  }
}

export default compose(
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
