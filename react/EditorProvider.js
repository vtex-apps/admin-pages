import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ExtensionPoint} from 'render'

import {getImplementation} from './utils/components'
import {editableExtensionPointKey} from './EditableExtensionPoint'

class EditorProvider extends Component {
  static childContextTypes = {
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
    extensions: PropTypes.object,
  }

  static contextTypes = {
    emitter: PropTypes.object,
  }

  static propTypes = {
    __originalComponent: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      editTreePath: null,
    }
  }

  getChildContext() {
    return {
      editExtensionPoint: this.editExtensionPoint,
      editMode: this.state.editMode,
      editTreePath: this.state.editTreePath,
      extensions: this.injectEditableExtensionPoints(this.context.extensions),
    }
  }

  injectEditableExtensionPoints = (extensions) =>
    Object.keys(extensions).reduce((acc, value) => {
      const extension = extensions[value]
      const Component = getImplementation(extension.component)
      if (Component && Component.schema) {
        acc[value] = {
          ...extension,
          component: editableExtensionPointKey,
          props: {
            ...extension.props,
            __originalComponent: extension.component,
            __treePath: value,
          },
        }
      } else {
        acc[value] = extension
      }
      return acc
    }, {})

  editExtensionPoint = (treePath) => {
    this.setState((state) => ({
      ...state,
      editTreePath: treePath,
    }))
  }

  toggleEditMode = () => {
    const {emitter} = this.context
    this.setState({
      ...this.state,
      editMode: !this.state.editMode,
    })
    emitter.emit('extension:*:update')
  }

  render() {
    const {__originalComponent: component, children, ...parentProps} = this.props
    const {editMode, editTreePath} = this.state
    const OriginalComponent = getImplementation(component)

    return (
      <div>
        <OriginalComponent {...parentProps}>{children}</OriginalComponent>
        <ExtensionPoint id="editor" toggleEditMode={this.toggleEditMode} editMode={editMode} editTreePath={editTreePath} />
      </div>
    )
  }
}

export default EditorProvider
