import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ExtensionPoint} from 'render'

import {getImplementation} from './utils/components'

class EditorProvider extends Component {
  static childContextTypes = {
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
    extensions: PropTypes.object,
  }

  static contextTypes = {
    components: PropTypes.object,
    extensions: PropTypes.object,
    emitter: PropTypes.object,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      editMode: false,
      editTreePath: null,
    }
    console.log(context.components)
    this.editableExtensionPointComponent = Object.keys(context.components).find(c => /vtex\.pages-editor@.*\/EditableExtensionPoint/.test(c))
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
          component: [extension.component, this.editableExtensionPointComponent],
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
    const {children, ...parentProps} = this.props
    const {editMode, editTreePath} = this.state

    return (
      <div>
        {React.cloneElement(children, parentProps)}
        <ExtensionPoint id="editor" toggleEditMode={this.toggleEditMode} editMode={editMode} editTreePath={editTreePath} />
      </div>
    )
  }
}

export default EditorProvider
