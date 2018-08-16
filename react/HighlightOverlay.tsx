import PropTypes from 'prop-types'
import React, { Component, CSSProperties, StatelessComponent } from 'react'
import { canUseDOM } from 'render'

let DEFAULT_HIGHLIGHT_RECT = { x: 0, y: 0, width: 0, height: 0 }

const HIGHLIGHT_REMOVAL_TIMEOUT_MS = 300

interface Props {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlightExtensionPoint: (treePath: string | null) => void
  highlightTreePath: string | null
}

interface State {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlightExtensionPoint: (treePath: string | null) => void
  highlightTreePath: string | null
}

export default class HighlightOverlay extends Component<Props, State> {
  public static propTypes = {
    editExtensionPoint: PropTypes.func,
    editMode: PropTypes.bool,
    highlightExtensionPoint: PropTypes.func,
    highlightTreePath: PropTypes.string,
  }

  public highlightRemovalTimeout: any

  constructor(props: any) {
    super(props)

    this.state = {
      editExtensionPoint: props.editExtensionPoint,
      editMode: props.editMode,
      highlightExtensionPoint: props.highlightExtensionPoint,
      highlightTreePath: props.highlightTreePath,
    }

    if (canUseDOM) {
      window.__setHighlightTreePath = (newState: State) => {
        this.setState(newState)
      }
    }

    this.highlightRemovalTimeout = null
  }

  public componentDidUpdate() {
    this.updateExtensionPointDOMElements(this.state.editMode)
  }

  public updateExtensionPointDOMElements = (editMode: boolean) => {
    const elements = Array.from(document.querySelectorAll(`[data-extension-point]`))
    elements.forEach((e: Element) => {
      const element = e as HTMLElement
      if (editMode) {
        element.addEventListener('mouseover', this.handleMouseOverHighlight as any)
        element.addEventListener('mouseleave', this.handleMouseLeaveHighlight)
        element.addEventListener('click', this.handleClickHighlight)
        element.style.cursor = 'pointer'
      } else {
        element.removeEventListener('mouseover', this.handleMouseOverHighlight as any)
        element.removeEventListener('mouseleave', this.handleMouseLeaveHighlight)
        element.removeEventListener('click', this.handleClickHighlight)
        element.style.cursor = null
      }
    })
  }

  public getHighlightRect = (highlightTreePath : string) => {
    const element = document.querySelector(`[data-extension-point="${highlightTreePath}"]`)
    const provider = document.querySelector('.render-provider')
    if (highlightTreePath && element && provider) {
      const rect = element.getBoundingClientRect() as DOMRect
      const providerRect = provider.getBoundingClientRect() as DOMRect

      // Add offset from render provider main div
      rect.y += -providerRect.y
      rect.x += -providerRect.x
      DEFAULT_HIGHLIGHT_RECT = rect

      return rect
    }
  }

  public handleMouseOverHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    const treePath = e.currentTarget.getAttribute('data-extension-point')
    this.state.highlightExtensionPoint(treePath)

    clearTimeout(this.highlightRemovalTimeout)
    e.stopPropagation()
  }

  public handleMouseLeaveHighlight = () => {
    if (this.highlightRemovalTimeout) {
      clearTimeout(this.highlightRemovalTimeout)
    }

    this.highlightRemovalTimeout = setTimeout(this.tryRemoveHighlight, HIGHLIGHT_REMOVAL_TIMEOUT_MS)
  }

  public tryRemoveHighlight = () => {
    this.state.highlightExtensionPoint(null)
  }

  public handleClickHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const { highlightTreePath } = this.state
    this.state.editExtensionPoint(highlightTreePath)
    this.state.highlightExtensionPoint(null)
  }

  public render() {
    const { highlightTreePath } = this.state
    const highlight = highlightTreePath && this.getHighlightRect(highlightTreePath)
    const { x: left, y: top, width, height } = highlight || DEFAULT_HIGHLIGHT_RECT
    const highlightStyle: CSSProperties = {
      animationDuration: '0.6s',
      height,
      left,
      pointerEvents: 'none',
      top,
      transition: highlight ? 'top 0.3s, left 0.3s, width 0.3s, height 0.3s' : undefined,
      width,
      zIndex: 999,
    }

    return (
      <div id="editor-provider-overlay" style={highlightStyle} className={`absolute ${highlight ? 'br2 b--blue b--dashed ba bg-light-blue o-50' : ''}`} />
    )
  }
}
