import PropTypes from 'prop-types'
import { difference, uniq } from 'ramda'
import React, { Component, Fragment } from 'react'
import { DataProps, graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import EditBar from './components/EditBar'
import { EditorContext } from './components/EditorContext'
import EditIcon from './images/EditIcon.js'
import ShowIcon from './images/ShowIcon.js'
import AvailableConditions from './queries/AvailableConditions.graphql'

interface EditorProviderState {
  activeConditions: string[]
  anyMatch: boolean
  editMode: boolean
  editTreePath: string | null
  highlightTreePath: string | null
  showAdminControls: boolean
  scope: ConfigurationScope
  device: ConfigurationDevice
}

class EditorProvider extends Component<{} & RenderContextProps & DataProps<{availableConditions: [Condition]}>, EditorProviderState> {
  public static contextTypes = {
    components: PropTypes.object,
  }

  public static propTypes = {
    availableConditions: PropTypes.object,
    children: PropTypes.element.isRequired,
    runtime: PropTypes.object,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      activeConditions: [],
      anyMatch: false,
      device: 'any',
      editMode: false,
      editTreePath: null,
      highlightTreePath: null,
      scope: 'url',
      showAdminControls: true,
    }
  }

  public componentDidMount() {
    const { runtime: { page } } = this.props
    const root = page.split('/')[0]
    if (root !== 'admin') {
      Array.prototype.forEach.call(
        document.getElementsByClassName('render-container'),
        (e: any) => e.classList.add('editor-provider'),
      )
    }
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public editExtensionPoint = (treePath: string | null) => {
    this.setState({ editTreePath: treePath, highlightTreePath: null })
  }

  public mouseOverExtensionPoint = (treePath: string | null) => {
    this.setState({ highlightTreePath: treePath })
  }

  public handleToggleEditMode = () => {
    this.setState(
      {
        editMode: !this.state.editMode,
      },
      () => {
        window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      }
    )
  }

  public handleToggleShowAdminControls = () => {
    const showAdminControls = !this.state.showAdminControls

    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      (e: any) => showAdminControls ? e.classList.add('editor-provider') : e.classList.remove('editor-provider'),
    )

    this.setState({ showAdminControls })
  }

  public handleAddCondition = (conditionId: string) => {
    this.setState({ activeConditions: uniq(this.state.activeConditions.concat(conditionId)) })
  }

  public handleRemoveCondition = (conditionId: string) => {
    const activeConditions = difference(this.state.activeConditions, [conditionId])
    this.setState({ activeConditions })
  }

  public handleSetScope = (scope: ConfigurationScope) => {
    this.setState({ scope })
  }

  public handleSetDevice = (device: ConfigurationDevice) => {
    this.setState({ device })
  }

  public render() {
    const { children, runtime, runtime: { page } } = this.props
    const { editMode, editTreePath, highlightTreePath, showAdminControls, activeConditions, anyMatch, device, scope } = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      anyMatch,
      conditions: this.props.data.availableConditions || [],
      device,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      highlightTreePath,
      mouseOverExtensionPoint: this.mouseOverExtensionPoint,
      removeCondition: this.handleRemoveCondition,
      scope,
      setDevice: this.handleSetDevice,
      setScope: this.handleSetScope,
      toggleEditMode: this.handleToggleEditMode,
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
        <EditIcon />
      </button>
    )

    const childrenWithSidebar = (
      <Fragment>
        <div
          className="fixed left-0 right-0 z-9999 h-3em"
          style={{
            animationDuration: '0.2s',
            transform: `translate(0,${showAdminControls?0:'-100%'})`,
            transition: `transform 300ms ease-in-out ${!showAdminControls?'300ms':''}`,
          }}
        >
          <ExtensionPoint id={`${root}/__topbar`}>
            <button
              type="button"
              onClick={this.handleToggleShowAdminControls}
              className={
                'bg-white bn link mh5 pl3 pv3 flex items-center justify-center z-max pointer animated fadeIn'
              }
            >
              <span className="pr5 br b--light-gray"><ShowIcon /></span>
            </button>
          </ExtensionPoint>
        </div>
        <EditBar editor={editor} runtime={runtime} visible={showAdminControls}>
          {children}
        </EditBar>
      </Fragment>
    )

    return (
      <EditorContext.Provider value={editor}>
        {adminControlsToggle}
        {childrenWithSidebar}
      </EditorContext.Provider>
    )
  }
}

export default graphql(AvailableConditions)(EditorProvider)
