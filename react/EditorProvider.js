import React, {Component} from 'react'
import PropTypes from 'prop-types'

import EditToggle from './components/EditToggle'

class EditorProvider extends Component {
  static childContextTypes = {
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
  }

  static contextTypes = {
    components: PropTypes.object,
    emitter: PropTypes.object,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    extensions: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false,
      editTreePath: null,
    }
  }

  editExtensionPoint = (treePath) => {
    const {emitter} = this.context
    this.setState({
      editTreePath: treePath,
    }, () => emitter.emit('editor:update', this.state))
  }

  toggleEditMode = () => {
    const {emitter} = this.context
    this.setState({
      editMode: !this.state.editMode,
    }, () => emitter.emit('editor:update', this.state))
  }

  hasEditableExtensionPoints = (extensions) => {
    console.log('TODO: implement hasEditableExtensionPoints', extensions)
    return true
  }

  getChildContext() {
    const {editMode, editTreePath} = this.state

    return {
      editMode,
      editTreePath,
      editExtensionPoint: this.editExtensionPoint,
    }
  }

  render() {
    const {children, extensions, ...parentProps} = this.props
    const {editMode, editTreePath} = this.state

    const clonedChildren = React.cloneElement(children, {key: 'editor-provider-children', ...parentProps})
    const showEditor = this.hasEditableExtensionPoints(extensions)
    const elements = [clonedChildren]
    if (showEditor) {
      elements.push(<EditToggle key="toggle" editMode={editMode} editTreePath={editTreePath} toggleEditMode={this.toggleEditMode} />)
    }

    return elements
  }
}

export default EditorProvider
