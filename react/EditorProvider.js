import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import ShowIcon from './images/ShowIcon.js'

import { getImplementation } from './utils/components'
import EditBar from './components/EditBar'
import Conditions from './queries/Conditions.graphql'

class EditorProvider extends Component {
  static childContextTypes = {
    activeCondition: PropTypes.object,
    conditions: PropTypes.object,
    editMode: PropTypes.bool,
    editTreePath: PropTypes.string,
    editExtensionPoint: PropTypes.func,
    getEditMode: PropTypes.func,
    onConditionSelection: PropTypes.func,
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
      activeCondition: { name: '', params: {} },
      editMode: false,
      showAdminControls: true,
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

  handleToggleShowAdminControls = () => {
    this.setState(
      {
        showAdminControls: !this.state.showAdminControls,
      }, () => {
        const { page } = this.props
        const root = page.split('/')[0]
        if (root !== 'admin') {
          if (this.state.showAdminControls) {
            Array.prototype.forEach.call(
              document.getElementsByClassName('render-container'),
              e => e.classList.add('editor-provider'),
            )
          } else {
            Array.prototype.forEach.call(
              document.getElementsByClassName('render-container'),
              e => e.classList.remove('editor-provider'),
            )
          }
        }
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

  handleConditionSelection = selectedCondition => {
    if (selectedCondition.name !== this.state.activeCondition.name) {
      this.setState({ activeCondition: selectedCondition })
    }
  }

  getChildContext() {
    const { conditions } = this.props.data
    const { activeCondition, editMode, editTreePath } = this.state

    return {
      activeCondition,
      conditions,
      editMode,
      editTreePath,
      editExtensionPoint: this.editExtensionPoint,
      getEditMode: this.getEditMode,
      onConditionSelection: this.handleConditionSelection,
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
    const { editMode, editTreePath, showAdminControls } = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const adminControlsToggle = showAdminControls ? null : (
      <button
        type="button"
        onClick={this.handleToggleShowAdminControls}
        className={
          'bg-blue br-100 bn shadow-1 flex items-center justify-center z-max fixed top-1 top-2-ns left-1 left-2-ns pointer grow hover-bg-heavy-blue animated fadeIn'
        }
        style={{ height: '56px', width: '56px', animationDuration: '0.2s' }}
      >
        <ShowIcon />
      </button>
    )

    return (
      <Fragment>
        {adminControlsToggle}
        {showAdminControls
          ? (
            <Fragment>
              <ExtensionPoint id={`${root}/__topbar`}>
                <button
                  type="button"
                  onClick={this.handleToggleShowAdminControls}
                  className={
                    'bg-blue br3 bn lh-title f6 fw5 link bn br2 mh2 pl3 pv3 pl4-l ph4-xl flex items-center justify-center z-max pointer hover-bg-heavy-blue animated fadeIn'
                  }
                  style={{ animationDuration: '0.2s' }}
                >
                  <span className="near-white ph4">HIDE</span>
                </button>
              </ExtensionPoint>
              <EditBar
                editMode={editMode}
                editTreePath={editTreePath}
                onToggleEditMode={this.handleToggleEditMode}
                page={page}
              >
                {children}
              </EditBar>
            </Fragment>
          )
          : children
        }
      </Fragment>
    )
  }
}

export default graphql(Conditions, {
  options: ({ page }) => ({
    variables: {
      locale: 'en',
      page,
      renderMajor: 7,
    },
  }),
})(EditorProvider)
