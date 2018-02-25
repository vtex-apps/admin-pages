import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'

import {getImplementation} from '../utils/components'
import {ObjectFieldTemplate, CustomFieldTemplate} from '../utils/formExtensions'

import SaveExtension from '../queries/SaveExtension.graphql'

const uiSchema = {
  'titleColor': {
    'ui:widget': 'color',
  },
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
          title: 'Componente',
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
      <div className="mw6 pa5 dark-gray center fixed z-999 bg-white" style={{top: '30px', right: '30px'}}>
        <Form
          schema={schema}
          formData={extensionProps}
          onChange={this.handleFormChange}
          onSubmit={this.handleSave}
          FieldTemplate={CustomFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          uiSchema={uiSchema}>
          <div className="mt5">
            <Button htmlProps={{type: 'submit', className: 'fw5 ph5 pv3 ttu br2 fw4 f7 bw1 ba b--blue bg-blue white hover-bg-heavy-blue hover-b--heavy-blue pointer mr5'}} primary>
              Salvar
            </Button>
            <Button onClick={this.handleCancel}>
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default graphql(SaveExtension, {name: 'saveExtension'})(ComponentEditor)
