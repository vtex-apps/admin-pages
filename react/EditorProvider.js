import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {ExtensionPoint} from 'render'

import EditableExtensionPoint from './EditableExtensionPoint'
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
    treePath: PropTypes.string,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.editableExtensionPointComponent = Object.keys(context.components).find(c => /vtex\.pages-editor@.*\/EditableExtensionPoint/.test(c))
    this.emptyExtensionPointComponent = Object.keys(context.components).find(c => /vtex\.pages-editor@.*\/EmptyExtensionPoint/.test(c))

    this.state = {
      editMode: false,
      editTreePath: null,
      extensions: this.injectEditableExtensionPoints(context.extensions),
    }
  }

  getChildContext() {
    return {
      editExtensionPoint: this.editExtensionPoint,
      editMode: this.state.editMode,
      editTreePath: this.state.editTreePath,
      extensions: this.state.extensions,
    }
  }

  componentWillReceiveProps() {
    this.setState({
      extensions: this.injectEditableExtensionPoints(this.context.extensions),
    })
  }

  injectEditableExtensionPoints = (extensions) => {
    this.hasEditableExtensionPoints = false
    return Object.keys(extensions).reduce((acc, value) => {
      // Skip internal extension points injected for asset loading (__extensible, __empty)
      if (/.*\/__(empty|extensible)$/.test(value)) {
        return acc
      }
      const extension = extensions[value]
      const Component = getImplementation(extension.component)

      if (extension.component === null) {
        acc[value] = {
          ...extension,
          component: [this.emptyExtensionPointComponent, this.editableExtensionPointComponent],
          props: {},
        }
        this.hasEditableExtensionPoints = true
      } else if (Component && Component.schema) {
        acc[value] = {
          ...extension,
          component: [extension.component, this.editableExtensionPointComponent],
        }
        this.hasEditableExtensionPoints = true
      } else {
        acc[value] = extension
      }
      return acc
    }, {})
  }

  editExtensionPoint = (treePath) => {
    this.setState({
      editTreePath: treePath,
    })
  }

  toggleEditMode = () => {
    const {emitter} = this.context
    this.setState({
      editMode: !this.state.editMode,
    })
    emitter.emit('extension:*:update')
  }

  render() {
    const {treePath, extensions} = this.context
    const {children, ...parentProps} = this.props
    const {editMode, editTreePath} = this.state

    const rootExtension = extensions[treePath]
    const component = Array.isArray(rootExtension.component) ? rootExtension.component[0] : rootExtension.component
    const Component = getImplementation(component)
    const isEditable = Component && Component.schema
    const clonedChildren = React.cloneElement(children, parentProps)
    const editableChildren = isEditable && <EditableExtensionPoint>{clonedChildren}</EditableExtensionPoint>
    const showEditor = this.hasEditableExtensionPoints || isEditable
    const elements = [editableChildren || clonedChildren]
    if (showEditor) {
      elements.push(<ExtensionPoint id="editor" toggleEditMode={this.toggleEditMode} editMode={editMode} editTreePath={editTreePath} />)
    }

    return elements
  }
}

export default EditorProvider
