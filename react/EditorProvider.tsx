import PropTypes from 'prop-types'
import { difference, uniq } from 'ramda'
import React, { Component, CSSProperties } from 'react'
import { DataProps, graphql, compose } from 'react-apollo'
import { canUseDOM, withRuntimeContext } from 'render'

import EditorContainer, { APP_CONTENT_ELEMENT_ID } from './components/EditorContainer'
import { EditorContext } from './components/EditorContext'
import AvailableConditions from './queries/AvailableConditions.graphql'

interface EditorProviderState {
  activeConditions: string[]
  allMatches: boolean
  editMode: boolean
  editTreePath: string | null
  showAdminControls: boolean
  scope: ConfigurationScope
  template: string | null
  viewport: Viewport
  iframeRuntime: RenderContext | null
  iframeWindow: Window
}

let iframeMessages: Record<string, string>

class EditorProvider extends Component<{} & RenderContextProps & DataProps<{ availableConditions: [Condition] }>, EditorProviderState> {
  public static contextTypes = {
    components: PropTypes.object,
  }

  public static propTypes = {
    availableConditions: PropTypes.object,
    children: PropTypes.element.isRequired,
    runtime: PropTypes.object,
  }

  public static getCustomMessages() {
    return iframeMessages
  }

  constructor(props: any) {
    super(props)

    this.state = {
      activeConditions: [],
      allMatches: true,
      editMode: false,
      editTreePath: null,
      iframeRuntime: null,
      iframeWindow: window,
      scope: 'url',
      showAdminControls: true,
      template: null,
      viewport: 'desktop',
    }

    if (canUseDOM) {
      window.__provideRuntime = (runtime: RenderContext, messages: Record<string, string>) => {
        iframeMessages = messages
        if (!this.state.iframeRuntime) {
          runtime.updateComponentAssets(props.runtime.components)
          this.props.runtime.updateComponentAssets({})
        }
        const newState = {
          iframeRuntime: runtime,
          ...(
            this.state.iframeRuntime
            ? {}
            : {
              iframeWindow: (document.getElementById('store-iframe') as HTMLElement).contentWindow as Window
            }
          )
        }
        this.setState(newState)
      }
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
    // Forward scroll events to window so code doesn't have to hook into #app-content
    document.getElementById(APP_CONTENT_ELEMENT_ID).addEventListener('scroll', (e) => { setTimeout(() => window.dispatchEvent(e), 0) }, { passive: true })
  }

  public editExtensionPoint = (treePath: string | null) => {
    this.setState({ editTreePath: treePath, editMode: false })
  }

  public handleToggleEditMode = () => {
    const editMode = !this.state.editMode
    this.setState({ editMode },
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

  public getAvailableViewports = (device: ConfigurationDevice): Viewport[] => {
    switch (device) {
      case 'mobile':
      return ['mobile', 'tablet']
      case 'desktop':
      return []
      default:
      return ['mobile', 'tablet', 'desktop']
    }
  }

  public handleSetViewport = (viewport: Viewport) => {
    this.setState({ viewport })
  }

  public render() {
    const { children, runtime: { device } } = this.props
    const { editMode, editTreePath, showAdminControls, activeConditions, allMatches, scope, viewport, iframeRuntime, iframeWindow } = this.state

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      conditions: this.props.data.availableConditions || [],
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      iframeWindow,
      removeCondition: this.handleRemoveCondition,
      scope,
      setDevice: this.handleSetDevice,
      setScope: this.handleSetScope,
      setViewport: this.handleSetViewport,
      toggleEditMode: this.handleToggleEditMode,
      viewport,
    }

    const childrenWithSidebar = (
      <EditorContainer
        editor={editor}
        runtime={iframeRuntime}
        toggleShowAdminControls={this.handleToggleShowAdminControls}
        viewports={this.getAvailableViewports(device)}
        visible={showAdminControls}
      >
        {children}
      </EditorContainer>
    )

    return (
      <EditorContext.Provider value={editor}>
        {childrenWithSidebar}
      </EditorContext.Provider>
    )
  }
}

export default compose(
  graphql(AvailableConditions),
  withRuntimeContext,
)(EditorProvider)
