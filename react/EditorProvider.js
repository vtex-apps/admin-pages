import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { ExtensionPoint } from 'render'
import { getImplementation } from './utils/components'

class EditorProvider extends Component {
  static childContextTypes = {
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
    mouseOverExtensionPoint: PropTypes.func,
  }

  static contextTypes = {
    components: PropTypes.object,
    emitter: PropTypes.object,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    extensions: PropTypes.object,
    pages: PropTypes.object,
    page: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false,
      editTreePath: null,
      mouseOverTreePath: null,
    }
  }

  editExtensionPoint = (treePath) => {
    const { emitter } = this.context
    this.setState({
      editTreePath: treePath,
      mouseOverTreePath: null,
    }, () => emitter.emit('editor:update', this.state))
  }

  toggleEditMode = () => {
    const { emitter } = this.context
    this.setState({
      editMode: !this.state.editMode,
      mouseOverTreePath: this.state.editMode ? null : this.state.mouseOverTreePath,
    }, () => emitter.emit('editor:update', this.state))
  }

  mouseOverExtensionPoint = (treePath) => {
    const { emitter } = this.context
    this.setState({
      mouseOverTreePath: treePath,
    }, () => emitter.emit('editor:update', this.state))
  }

  hasEditableExtensionPoints = (extensions) => {
    return Object.keys(extensions).find((k) => {
      // Skip internal extension points injected for asset loading
      if (/.*\/__(empty|editable|provider)$/.test(k)) {
        return false
      }
      const extension = extensions[k]
      const Component = getImplementation(extension.component)
      return (extension.component === null) ||
        (Component && Component.schema)
    }) !== undefined
  }

  getChildContext() {
    const { editMode, editTreePath } = this.state

    return {
      editMode,
      editTreePath,
      editExtensionPoint: this.editExtensionPoint,
      mouseOverExtensionPoint: this.mouseOverExtensionPoint,
    }
  }

  render() {
    const { children, extensions, page } = this.props
    const { editMode, editTreePath } = this.state
    const root = page.split('/')[0]

    const hasEditableExtensionPoints = this.hasEditableExtensionPoints(extensions)
    const isAdmin = root === 'admin'

    return (
      <Fragment>
        {!isAdmin && <ExtensionPoint
          id={`${root}/__topbar`}
          hasEditableExtensionPoints={hasEditableExtensionPoints}
          editMode={editMode}
          editTreePath={editTreePath}
          toggleEditMode={this.toggleEditMode}
          page={page} />}
        {children}
      </Fragment>
    )
  }
}

export default EditorProvider
