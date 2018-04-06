import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'

import SaveExtension from '../queries/SaveExtension.graphql'
import {getImplementation} from '../utils/components'

import BaseInput from './form/BaseInput'
import FieldTemplate from './form/FieldTemplate'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'

import Draggable from 'react-draggable'
import CloseIcon from '../images/CloseIcon.js'

const uiSchema = {
  'titleColor': {
    'ui:widget': 'color',
  },
  'description': {
    classNames: 'bg-blue',
  },
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
    const {component} = event.formData
    const props = event.formData

    this.context.updateExtension(this.props.treePath, {
      component,
      props,
    })
  }

  handleSave = (event) => {
    console.log('save', event, this.props)
    const {saveExtension, component, props} = this.props
    saveExtension({
      variables: {
        extensionName: this.props.treePath,
        component,
        props: JSON.stringify(props),
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
    const {component, props} = this.props
    const Component = getImplementation(component)
    const editableComponents = this.getEditableComponents()

    const componentSchema = Component && Component.schema ? Component.schema : {
      type: 'object',
      properties: {},
    }

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

    const extensionProps = {
      component,
      ...props,
    }

    return (
      <div className="w-100 near-black">
        <div className="fixed z-999 bg-white shadow-4 w-100 bottom-0 left-0 dn-ns overflow-scroll animated shadow-editor" style={{height: '60vh', minHeight:'300px'}} >
          <div className="bg-serious-black white fw5 f5 ph5 pv5 lh-title w-100 fixed flex justify-between items-center">
            <div>
              Nome do componente
            </div>
            <div onClick={this.handleCancel} className="flex items-center">
              <CloseIcon />
            </div>
          </div>
          <div className="pt8 pb8 mb3 center">
            <Form
              schema={schema}
              formData={extensionProps}
              onChange={this.handleFormChange}
              onSubmit={this.handleSave}
              FieldTemplate={FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              uiSchema={uiSchema}
              widgets={widgets}>
              <div className="fixed bg-near-white w-100 pv4 bottom-0 left-0 pl5 flex bt b--light-silver">
                <div className="mr4">
                  <Button htmlProps={{type: 'submit'}} primary>
                    Save
                  </Button>
                </div>
                <button className="fw5 ttu br2 fw4 f7 pv3 ph5 blue bg-near-white pointer bn" onClick={this.handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        </div>
        <Draggable handle=".draggable">
          <div className={`dn di-ns mw6 center br2 fixed-ns z-999 bg-white shadow-4 w-100 top-2-ns right-2-ns mt9 move animated ${this._isMounted ? '' : 'fadeIn'}`} style={{animationDuration: '0.2s'}}>
            <div className="bg-serious-black white fw5 f5 ph5 pv5 lh-title w-100 fixed flex justify-between br2 br--top draggable">
              <div>
                Nome do componente
              </div>
            </div>
            <div className="pt8">
              <Form
                schema={schema}
                formData={extensionProps}
                onChange={this.handleFormChange}
                onSubmit={this.handleSave}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={ObjectFieldTemplate}
                uiSchema={uiSchema}
                widgets={widgets}>
                <div className="flex mt5 pb5 pl5">
                  <div className="mr4">
                    <Button htmlProps={{type: 'submit'}} primary>
                      Save
                    </Button>
                  </div>
                  <Button onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Draggable>
      </div>
    )
  }
}

export default graphql(SaveExtension, {name: 'saveExtension'})(ComponentEditor)
