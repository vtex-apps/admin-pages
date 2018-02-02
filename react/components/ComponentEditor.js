import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'

import SaveExtension from './SaveExtension.graphql'

function ObjectFieldTemplate(props) {
  return (
    <div className="f6 fw5">
      {props.properties.map(prop => prop.content)}
    </div>
  )
}

function CustomFieldTemplate(props) {
  const {id, classNames, label, help, required, description, errors, children} = props
  return (
    <div className={classNames + ' fw5'}>
      <label className="mb3 mt5 fw7 db" htmlFor={id}>{label}{required ? '*' : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </div>
  )
}

const uiSchema = {
  'titleColor': {
    'ui:widget': 'color',
  },
}

class ComponentEditor extends Component {
  static propTypes = {
    extensionName: PropTypes.any,
    saveExtension: PropTypes.any,
  }

  static contextTypes = {
    editExtensionPoint: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      extensionName: props.extensionName,
      extension: global.__RUNTIME__.extensions[props.extensionName],
      oldPropsJSON: JSON.stringify(global.__RUNTIME__.extensions[props.extensionName].props),
    }
  }

  handleFormChange = (event) => {
    console.log('Updating props with formData...', event.formData)
    global.__RUNTIME__.extensions[this.state.extensionName].props = event.formData
    global.__RUNTIME__.eventEmitter.emit(`extension:${this.state.extensionName}:update`)
  }

  handleSave = (event) => {
    console.log('save', event, this.state)
    const {saveExtension} = this.props
    saveExtension({
      variables: {
        extensionName: this.state.extensionName,
        component: this.state.extension.component,
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
    global.__RUNTIME__.extensions[this.state.extensionName].props = oldProps
    global.__RUNTIME__.eventEmitter.emit(`extension:${this.state.extensionName}:update`)
    this.context.editExtensionPoint(null)
  }

  render() {
    const {extension} = this.state
    const component = global.__RENDER_6_COMPONENTS__[extension.component]

    return (
      <div className="mw6 ph5 dark-gray center mv5">
        <Form
          schema={component.schema}
          formData={extension.props}
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
