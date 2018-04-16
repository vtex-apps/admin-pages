import Button from '@vtex/styleguide/lib/Button'
import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { graphql } from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'
import { pick } from 'ramda'

import SaveExtension from '../queries/SaveExtension.graphql'
import { getImplementation } from '../utils/components'

import BaseInput from './form/BaseInput'
import FieldTemplate from './form/FieldTemplate'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'

import Draggable from 'react-draggable'
import CloseIcon from '../images/CloseIcon.js'

const defaultUiSchema = {
  'classNames': 'editor-form',
}

const widgets = {
  BaseInput,
}

class ComponentEditor extends Component {
  static propTypes = {
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

    this.old = JSON.stringify({
      component: props.component,
      props: props.props,
    })
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  handleFormChange = (event) => {
    console.log('Updating extension with formData...', event.formData)
    const { component } = event.formData
    const props = event.formData

    this.context.updateExtension(this.props.treePath, {
      component,
      props,
    })
  }

  handleSave = (event) => {
    console.log('save', event, this.props)
    const { saveExtension, component, props } = this.props
    const Component = getImplementation(component)
    const componentSchema = Component && Component.schema
    const propsToSave = Object.keys(componentSchema.properties)
    const pickedProps = pick(propsToSave, props)
    saveExtension({
      variables: {
        extensionName: this.props.treePath,
        component,
        props: JSON.stringify(pickedProps),
      },
    })
      .then((data) => {
        console.log('OK!', data)
        this.context.editExtensionPoint(null)
      })
      .catch(err => {
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

  getEditableComponents = () => {
    return Object.keys(global.__RUNTIME__.components).filter(c => !c.endsWith('.css'))
  }

  render() {
    const { component, props } = this.props
    const Component = getImplementation(component)
    const editableComponents = this.getEditableComponents()

    const componentSchema = Component && Component.schema ? Component.schema : {
      type: 'object',
      properties: {},
    }

    const componentUiSchema = Component && Component.uiSchema ? Component.uiSchema : null

    const displayName = componentSchema.component

    const mobile = window.innerWidth < 600
    const animation = mobile ? 'slideInUp' : 'fadeIn'

    const schema = {
      ...componentSchema,
      properties: {
        component: {
          enum: editableComponents,
          enumNames: editableComponents,
          title: 'Component',
          type: 'string',
        },
        ...componentSchema.properties,
      },
    }

    const uiSchema = {
      ...defaultUiSchema,
      ...componentUiSchema,
    }

    const extensionProps = {
      component,
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
                  <div className="w-50 tc bg-near-white hover-bg-light-silver pointer hover-heavy-blue">
                    <Button block size="large" type="submit">
                      Save
                    </Button>
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

export default graphql(SaveExtension, { name: 'saveExtension' })(ComponentEditor)
