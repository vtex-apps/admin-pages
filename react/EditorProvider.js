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
    getEditMode: PropTypes.func,
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
    }
  }

  editExtensionPoint = treePath => {
    const { emitter } = this.context
    this.setState(
      {
        editTreePath: treePath,
      },
      () => emitter.emit('editor:update', this.state)
    )
  }

  handleToggleEditMode = () => {
    const { emitter } = this.context
    this.setState(
      {
        editMode: !this.state.editMode,
      },
      () => {
        emitter.emit('editor:update', this.state)
        window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      }
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

  getEditMode = () => {
    return this.state.editMode
  }

  getChildContext() {
    const { editMode, editTreePath } = this.state

    return {
      editMode,
      editTreePath,
      editExtensionPoint: this.editExtensionPoint,
      getEditMode: this.getEditMode,
    }
  }

  componentDidMount() {
    const { page } = this.props
    const root = page.split('/')[0]
    if (root !== 'admin') {
      Array.prototype.forEach.call(
        document.getElementsByClassName('render-container'),
        e => e.classList.add('editor-provider'),
      )
    }
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  componentWillUnmount() {
    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      e => e.classList.remove('editor-provider'),
    )
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
        type="button"
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
