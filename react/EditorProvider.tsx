import PropTypes from 'prop-types'
import { difference, uniq } from 'ramda'
import React, { Component, Fragment } from 'react'
import { DataProps, graphql } from 'react-apollo'
import { ExtensionPoint } from 'render'

import Draggable from 'react-draggable'
import DeviceSwitcher from './components/DeviceSwitcher'
import EditBar from './components/EditBar'
import { EditorContext } from './components/EditorContext'
import SelectionIcon from './images/SelectionIcon.js'
import ShowIcon from './images/ShowIcon.js'
import AvailableConditions from './queries/AvailableConditions.graphql'

interface EditorProviderState {
  activeConditions: string[]
  allMatches: boolean
  editMode: boolean
  editTreePath: string | null
  highlight: DOMRect | null
  showAdminControls: boolean
  scope: ConfigurationScope
  template: string | null
  viewport: Viewport
}

const DEFAULT_HIGHLIGHT_RECT = { x: 0, y: 0, width: 0, height: 0 }

const updateDefaultHighlightRect = (e: any) => {
  const provider = document.querySelector('.render-provider')
  const providerRect = provider && provider.getBoundingClientRect() as DOMRect

  DEFAULT_HIGHLIGHT_RECT.y = e.pageY + (providerRect ? -providerRect.y : 0)
  DEFAULT_HIGHLIGHT_RECT.x = e.pageX + (providerRect ? -providerRect.x : 0)
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

  public highlightRemovalTimeout: any

  constructor(props: any) {
    super(props)

    this.highlightRemovalTimeout = null

    this.state = {
      activeConditions: [],
      allMatches: true,
      editMode: false,
      editTreePath: null,
      highlight: null,
      scope: 'url',
      showAdminControls: true,
      template: null,
      viewport: 'desktop',
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
    document.onmousemove = updateDefaultHighlightRect
  }

  public updateExtensionPointDOMElements = (editMode: boolean) => {
    const elements = document.querySelectorAll(`[data-extension-point]`)
    elements.forEach((e: Element) => {
      if (editMode) {
        e.addEventListener('mouseover', this.handleMouseOverHighlight as any)
        e.addEventListener('mouseleave', this.handleMouseLeaveHighlight)
        e.addEventListener('click', this.handleClickHighlight)
        e.style.cursor = 'pointer'
      } else {
        e.removeEventListener('mouseover', this.handleMouseOverHighlight as any)
        e.removeEventListener('mouseleave', this.handleMouseLeaveHighlight)
        e.removeEventListener('click', this.handleClickHighlight)
        e.style.cursor = null
      }
    })
  }

  public editExtensionPoint = (treePath: string | null) => {
    this.setState({ editTreePath: treePath, highlight: null, editMode: false },
      () => this.updateExtensionPointDOMElements(false))
  }

  public highlightExtensionPoint = (treePath: string | null) => {
    if (!treePath) {
      this.setState({ highlight: null })
    }

    const element = document.querySelector(`[data-extension-point="${treePath}"]`)
    const provider = document.querySelector('.render-provider')
    if (element && provider) {
      const rect = element.getBoundingClientRect() as DOMRect
      const providerRect = provider.getBoundingClientRect() as DOMRect

      // Add offset from render provider main div
      rect.y += -providerRect.y
      rect.x += -providerRect.x

      this.setState({ highlight: rect })
    }
  }

  public handleToggleEditMode = () => {
    const editMode = !this.state.editMode
    this.setState({ editMode },
      () => {
        this.updateExtensionPointDOMElements(editMode)
        window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      })
  }

  public handleMouseOverHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    const treePath = e.currentTarget.getAttribute('data-extension-point')

    clearTimeout(this.highlightRemovalTimeout)
    this.highlightExtensionPoint(treePath)
    e.stopPropagation()
  }

  public handleMouseLeaveHighlight = () => {
    if (this.highlightRemovalTimeout) {
      clearTimeout(this.highlightRemovalTimeout)
    }

    this.highlightRemovalTimeout = setTimeout(this.tryRemoveHighlight, 300)
  }

  public tryRemoveHighlight = () => {
    this.highlightExtensionPoint(null)
  }

  public handleClickHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const treePath = e.currentTarget.getAttribute('data-extension-point')
    this.editExtensionPoint(treePath)
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
    const { editMode, editTreePath, highlight, showAdminControls, activeConditions, allMatches, scope, viewport} = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      conditions: this.props.data.availableConditions || [],
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      highlightExtensionPoint: this.highlightExtensionPoint,
      removeCondition: this.handleRemoveCondition,
      scope,
      setDevice: this.handleSetDevice,
      setScope: this.handleSetScope,
      setViewport: this.handleSetViewport,
      toggleEditMode: this.handleToggleEditMode,
      viewport,
    }

    const getAvailableViewports = (d: ConfigurationDevice): Viewport[] => {
      switch (d) {
        case 'mobile':
          return ['mobile', 'tablet']
        case 'desktop':
          return []
        default:
          return ['mobile', 'tablet', 'desktop']
      }
    }

    const adminControlsStyle = {
      animationDuration: '0.6s',
      transition: `visibility 600ms step-start ${showAdminControls ? '' : '600ms'}`,
      visibility: `${showAdminControls ? 'hidden' : 'visible'}`,
    }

    const adminControlsToggle = (
      <Draggable bounds="body">
        <div style={adminControlsStyle} className="animated br2 bg-white bn shadow-1 flex items-center justify-center z-max relative fixed top-1 top-2-ns right-1 right-2-ns">
          <DeviceSwitcher toggleEditMode={this.handleToggleShowAdminControls} editor={editor} viewports={getAvailableViewports(device)} />
        </div>
      </Draggable>
    )

    const {x: left, y: top, width, height} = highlight || DEFAULT_HIGHLIGHT_RECT
    const highlightStyle = {
      animationDuration: '0.6s',
      height,
      left,
      pointerEvents: 'none',
      top,
      transition: highlight ? 'top 0.3s, left 0.3s, width 0.3s, height 0.3s' : undefined,
      width,
      zIndex: 999,
    }

    const topbarStyle = {
      animationDuration: '0.2s',
      transform: `translate(0,${showAdminControls?0:'-100%'})`,
      transition: `transform 300ms ease-in-out ${!showAdminControls?'300ms':''}`,
    }

    const childrenWithSidebar = (
      <Fragment>
        <div
          className="fixed left-0 right-0 z-9999 h-3em"
          style={topbarStyle}
        >
          <ExtensionPoint id={`${root}/__topbar`}>
            <button
              type="button"
              onClick={this.handleToggleEditMode}
              className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
            >
              <span className="pr5 b--light-gray flex items-center"><SelectionIcon stroke={this.state.editMode ? '#368df7' : '#979899'}/></span>
            </button>
            <button
              type="button"
              onClick={this.handleToggleShowAdminControls}
              className="bg-white bn link pl3-ns pv3 flex items-center justify-center self-right z-max pointer animated fadeIn"
            >
              <span className="pr5 b--light-gray flex items-center"><ShowIcon /></span>
            </button>
          </ExtensionPoint>
        </div>
        <EditBar editor={editor} runtime={runtime} visible={showAdminControls}>
          <Fragment>
            <div id="editor-provider-overlay" style={highlightStyle} className={`absolute ${highlight ? 'br2 b--blue b--dashed ba bg-light-blue o-50' : ''}`} />
            {children}
          </Fragment>
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
