import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'render'

import EditIcon from './images/EditIcon.js'

import { getImplementation } from './utils/components'
import EditBar from './components/EditBar'

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

  editExtensionPoint = treePath => {
    const { emitter } = this.context
    this.setState(
      {
        editTreePath: treePath,
        mouseOverTreePath: null,
      },
      () => emitter.emit('editor:update', this.state)
    )
  }

  handleToggleEditMode = () => {
    const { emitter } = this.context
    this.setState(
      {
        editMode: !this.state.editMode,
        mouseOverTreePath: this.state.editMode
          ? null
          : this.state.mouseOverTreePath,
      },
      () => {
        emitter.emit('editor:update', this.state)
        window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      }
    )
  }

  mouseOverExtensionPoint = treePath => {
    const { emitter } = this.context
    this.setState(
      {
        mouseOverTreePath: treePath,
      },
      () => emitter.emit('editor:update', this.state)
    )
  }

  hasEditableExtensionPoints = extensions => {
    return (
      Object.keys(extensions).find(k => {
        // Skip internal extension points injected for asset loading
        if (/.*\/__(empty|editable|provider)$/.test(k)) {
          return false
        }
        const extension = extensions[k]
        const Component = getImplementation(extension.component)
        return extension.component === null || (Component && Component.schema)
      }) !== undefined
    )
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

  componentDidMount() {
    const { page } = this.props
    const root = page.split('/')[0]
    if (root !== 'admin') {
      document.getElementById('render-container') &&
        document
          .getElementById('render-container')
          .classList.add('editor-provider')
    }
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  componentWillUnmount() {
    document.getElementById('render-container') &&
      document
        .getElementById('render-container')
        .classList.remove('editor-provider')
  }

  render() {
    const { children, page } = this.props
    const { editMode, editTreePath } = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const topbar = editMode ? (
      <EditBar
        editMode={editMode}
        editTreePath={editTreePath}
        onToggleEditMode={this.handleToggleEditMode}
        page={page}
      />
    ) : (
      <ExtensionPoint id={`${root}/__topbar`} />
    )

    const editToggle = editMode ? null : (
      <button
        onClick={this.handleToggleEditMode}
        className={
          'bg-blue br-100 bn shadow-1 flex items-center justify-center z-max fixed bottom-1 bottom-2-ns right-1 right-2-ns pointer grow hover-bg-heavy-blue animated fadeIn'
        }
        style={{ height: '56px', width: '56px', animationDuration: '0.2s' }}
      >
        <EditIcon />
      </button>
    )

    return (
      <Fragment>
        {topbar}
        {editToggle}
        {children}
      </Fragment>
    )
  }
}

export default EditorProvider
