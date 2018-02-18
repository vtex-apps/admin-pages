import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'

import {getImplementation} from '../utils/components'
import {ObjectFieldTemplate, CustomFieldTemplate} from '../utils/formExtensions'

import SaveExtension from '../queries/SaveExtension.graphql'

function c(component) {
  return Array.isArray(component) ? component[0] : component
}

const uiSchema = {
  'titleColor': {
    'ui:widget': 'color',
  },
}

class ComponentEditor extends Component {
  static propTypes = {
    editTreePath: PropTypes.any,
    saveExtension: PropTypes.any,
  }

  static contextTypes = {
    editExtensionPoint: PropTypes.func,
    updateExtension: PropTypes.func,
    emitter: PropTypes.object,
    extensions: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editTreePath: props.editTreePath,
      extension: context.extensions[props.editTreePath],
      oldPropsJSON: JSON.stringify(context.extensions[props.editTreePath].props),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editTreePath: nextProps.editTreePath,
      extension: this.context.extensions[nextProps.editTreePath],
      oldPropsJSON: JSON.stringify(this.context.extensions[nextProps.editTreePath].props),
    })
  }

  handleFormChange = (event) => {
    console.log('Updating props with formData...', event.formData)
    const extension = this.context.extensions[this.state.editTreePath]
    const extensionComponent = c(extension.component)

    const {component: propsComponent} = event.formData
    if (propsComponent && (extensionComponent !== propsComponent)) {
      extension.component = Array.isArray(extensionComponent)
        ? [propsComponent, extensionComponent[1]] : propsComponent
    }

    extension.props = event.formData
    this.context.updateExtension(this.state.editTreePath, extension)
    this.context.emitter.emit(`extension:${this.state.editTreePath}:update`)
  }

  handleSave = (event) => {
    console.log('save', event, this.state)
    const {saveExtension} = this.props
    saveExtension({
      variables: {
        extensionName: this.state.editTreePath,
        component: c(this.state.extension.component),
        props: JSON.stringify(this.state.extension.props),
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

  handleCancel = () => {
    const oldProps = JSON.parse(this.state.oldPropsJSON)
    console.log('Updating props with old props...', oldProps)
    this.context.extensions[this.state.editTreePath].props = oldProps
    this.context.emitter.emit(`extension:${this.state.editTreePath}:update`)
    this.context.editExtensionPoint(null)
  }

  getEditableComponents = () => {
    return Object.keys(global.__RUNTIME__.components).filter(component => {
      const Component = getImplementation(component)
      return Component && Component.schema
    })
  }

  render() {
    const {extension} = this.state
    const Component = getImplementation(c(extension.component))
    const editableComponents = this.getEditableComponents()

    const schema = {
      ...Component.schema,
      properties: {
        component: {
          enum: editableComponents,
          enumNames: editableComponents,
          title: 'Componente',
          type: 'string',
        },
        ...Component.schema.properties,
      },
    }

    const extensionProps = {
      component: c(extension.component),
      ...extension.props,
    }

    return (
      <div className="mw6 ph5 dark-gray center mv5">
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
            <Button htmlProps={{onClick: this.handleCancel}}>
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default graphql(SaveExtension, {name: 'saveExtension'})(ComponentEditor)
