import PropTypes from 'prop-types'
import { difference, uniq } from 'ramda'
import React, { Component, Fragment } from 'react'
import { DataProps, graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import EditBar from './components/EditBar'
import { EditorContext } from './components/EditorContext'
import ShowIcon from './images/ShowIcon.js'
import SelectionIcon from './images/SelectionIcon.js'
import AvailableConditions from './queries/AvailableConditions.graphql'
import DeviceSwitcher from './components/DeviceSwitcher'
import Draggable from 'react-draggable'

interface EditorProviderState {
  activeConditions: string[]
  anyMatch: boolean
  editMode: boolean
  editTreePath: string | null
  highlightTreePath: string | null
  showAdminControls: boolean
  scope: ConfigurationScope
  template: string | null
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
      editMode: false,
      editTreePath: null,
      highlightTreePath: null,
      scope: 'url',
      showAdminControls: true,
      template: null,
      viewport: 'desktop'
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
    this.setState({ editTreePath: treePath, highlightTreePath: null, editMode: false })
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
    const editMode = false

    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      (e: any) => showAdminControls ? e.classList.add('editor-provider') : e.classList.remove('editor-provider'),
    )

    this.setState({ showAdminControls, editMode })
  }

  public handleAddCondition = (conditionId: string) => {
    this.setState({ activeConditions: uniq(this.state.activeConditions.concat(conditionId)) }, () => {
      this.props.runtime.updateRuntime({
        conditions: this.state.activeConditions,
        device: this.props.runtime.device,
        scope: this.state.scope,
        template: this.state.template,
      })
    })
  }

  public handleRemoveCondition = (conditionId: string) => {
    const activeConditions = difference(this.state.activeConditions, [conditionId])
    this.setState({ activeConditions }, () => {
      this.props.runtime.updateRuntime({
        conditions: this.state.activeConditions,
        device: this.props.runtime.device,
        scope: this.state.scope,
        template: this.state.template,
      })
    })
  }

  public handleSetScope = (scope: ConfigurationScope) => {
    this.setState({ scope })
  }

  public getViewport = (device: ConfigurationDevice) => {
    switch (device) {
      case 'any':
        return 'desktop'
      default:
        return device
    }
  }

  public handleSetDevice = (device: ConfigurationDevice) => {
    this.props.runtime.setDevice(device)
    this.handleSetViewport(this.getViewport(device))
    this.props.runtime.updateRuntime({
      conditions: this.state.activeConditions,
      device,
      scope: this.state.scope,
      template: this.state.template,
    })
  }

  public handleSetViewport = (viewport: Viewport) => {
    this.setState({ viewport })
  }

  public render() {
    const { children, runtime, runtime: { page, device } } = this.props
    const { editMode, editTreePath, highlightTreePath, showAdminControls, activeConditions, anyMatch, scope, viewport} = this.state
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
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      highlightTreePath,
      mouseOverExtensionPoint: this.mouseOverExtensionPoint,
      removeCondition: this.handleRemoveCondition,
      scope,
      viewport,
      setDevice: this.handleSetDevice,
      setViewport: this.handleSetViewport,
      setScope: this.handleSetScope,
      toggleEditMode: this.handleToggleEditMode,
    }

    const getAvailableViewports = (device: ConfigurationDevice) => {
      switch (device) {
        case 'mobile':
          return ['mobile', 'tablet']
        case 'desktop':
          return []
        default:
          return ['mobile', 'tablet', 'desktop']
      }
    }

    const adminControlsToggle = (
      <Draggable bounds='body'>
        <div className="animated br2 bg-white bn shadow-1 flex items-center justify-center z-max relative fixed top-1 top-2-ns right-1 right-2-ns"
          style={
            {
              animationDuration: '0.6s',
              visibility: `${showAdminControls?'hidden':'visible'}`,
              transition: `visibility 600ms step-start ${showAdminControls?'':'600ms'}`
            }
          }
          >
          <DeviceSwitcher toggleEditMode={this.handleToggleShowAdminControls} editor={editor} viewports={getAvailableViewports(device)} />
        </div>
      </Draggable>
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
            <DeviceSwitcher toggleEditMode={this.handleToggleShowAdminControls} editor={editor} viewports={getAvailableViewports(device)} onTopbar/>
            <div className={'br-s bl-s b--light-gray ph3-ns flex'}>
              <div
                onClick={this.handleToggleEditMode}
                className={
                  'bg-white bn link ph4 flex items-center justify-center self-right z-max pointer animated fadeIn'
                }
              >
                <span className="flex items-center"><SelectionIcon stroke={this.state.editMode ? "#368df7" : "#979899"}/></span>
              </div>
              <div
                onClick={this.handleToggleShowAdminControls}
                className={
                  'bg-white bn link ph4 flex items-center justify-center self-right z-max pointer animated fadeIn'
                }
              >
                <span className="flex items-center"><ShowIcon /></span>
              </div>
            </div>
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
