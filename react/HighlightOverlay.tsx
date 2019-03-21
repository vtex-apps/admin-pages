import PropTypes from 'prop-types'
import React, { Component, CSSProperties } from 'react'
import { canUseDOM } from 'vtex.render-runtime'

let DEFAULT_HIGHLIGHT_RECT = { x: 0, y: 0, width: 0, height: 0 }

const HIGHLIGHT_REMOVAL_TIMEOUT_MS = 300

interface Props {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlighHandler: (treePath: string | null) => void
  highlightTreePath: string | null
}

export interface State {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlighHandler: (treePath: string | null) => void
  highlightTreePath: string | null
}

export default class HighlightOverlay extends Component<Props, State> {
  public static propTypes = {
    editExtensionPoint: PropTypes.func,
    editMode: PropTypes.bool,
    highlighHandler: PropTypes.func,
    highlightTreePath: PropTypes.string,
  }

  public highlightRemovalTimeout: any

  private INITIAL_HIGHLIGHT_RECT = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      editExtensionPoint: props.editExtensionPoint,
      editMode: props.editMode,
      highlighHandler: props.highlighHandler,
      highlightTreePath: props.highlightTreePath,
    }

    const highlightableWindow = window as HighlightableWindow

    if (canUseDOM) {
      highlightableWindow.__setHighlightTreePath = (newState: State) => {
        this.setState(newState)
      }
    }

    this.highlightRemovalTimeout = null
  }

  public componentDidUpdate() {
    this.updateExtensionPointDOMElements(this.state.editMode)
  }

  public updateExtensionPointDOMElements = (editMode: boolean) => {
    const elements = Array.from(
      document.querySelectorAll(`[data-extension-point]`)
    )
    elements.forEach((e: Element) => {
      const element = e as HTMLElement
      if (editMode) {
        element.addEventListener('mouseover', this
          .handleMouseOverHighlight as any)
        element.addEventListener('mouseleave', this.handleMouseLeaveHighlight)
        element.addEventListener('click', this.handleClickHighlight)
        element.style.cursor = 'pointer'
      } else {
        element.removeEventListener('mouseover', this
          .handleMouseOverHighlight as any)
        element.removeEventListener(
          'mouseleave',
          this.handleMouseLeaveHighlight
        )
        element.removeEventListener('click', this.handleClickHighlight)
        element.style.cursor = null
      }
    })
  }

  public getHighlightRect = (highlightTreePath: string) => {
    const elements = document.querySelectorAll(
      `[data-extension-point="${highlightTreePath}"]`
    )

    const provider = document.querySelector('.render-provider')

    const iframeBody = document.querySelector('body')

    if (highlightTreePath && elements && provider) {
      const paddingFromIframeBody = iframeBody
        ? {
            left: parseInt(
              window.getComputedStyle(iframeBody, null).paddingLeft || '0',
              10
            ),
            right: parseInt(
              window.getComputedStyle(iframeBody, null).paddingRight || '0',
              10
            ),
          }
        : {
            left: 0,
            right: 0,
          }

      const providerRect = provider.getBoundingClientRect() as DOMRect

      const elementsArray: Element[] = Array.prototype.slice.call(elements)

      const element = elementsArray.find(currElement => {
        const currRect = currElement.getBoundingClientRect()

        return currRect.width > 0 && currRect.height > 0
      })

      const rect = element
        ? (element.getBoundingClientRect() as DOMRect)
        : this.INITIAL_HIGHLIGHT_RECT

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }

      // Add offset from render provider main div
      rect.y += -providerRect.y
      rect.x +=
        -providerRect.x +
        (paddingFromIframeBody.left + paddingFromIframeBody.right) / 2

      DEFAULT_HIGHLIGHT_RECT = rect
      return rect
    }
  }

  public handleMouseOverHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    const treePath = e.currentTarget.getAttribute('data-extension-point')
    this.state.highlighHandler(treePath)

    clearTimeout(this.highlightRemovalTimeout)
    e.stopPropagation()
  }

  public handleMouseLeaveHighlight = () => {
    if (this.highlightRemovalTimeout) {
      clearTimeout(this.highlightRemovalTimeout)
    }

    this.highlightRemovalTimeout = setTimeout(
      this.tryRemoveHighlight,
      HIGHLIGHT_REMOVAL_TIMEOUT_MS
    )
  }

  public tryRemoveHighlight = () => {
    this.state.highlighHandler(null)
  }

  public handleClickHighlight = (e: any) => {
    if (!e.currentTarget) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const { highlightTreePath } = this.state
    this.state.editExtensionPoint(highlightTreePath)
    this.state.highlighHandler(null)
  }

  public render() {
    const { highlightTreePath } = this.state
    const highlight =
      highlightTreePath && this.getHighlightRect(highlightTreePath)
    const { x: left, y: top, width, height } =
      highlight || DEFAULT_HIGHLIGHT_RECT
    const highlightStyle: CSSProperties = {
      animationDuration: '0.6s',
      height,
      left,
      pointerEvents: 'none',
      top,
      transition: highlight
        ? 'top 0.3s, left 0.3s, width 0.3s, height 0.3s'
        : undefined,
      width,
      zIndex: 999,
    }

    return (
      <div
        id="editor-provider-overlay"
        style={highlightStyle}
        className={`absolute ${
          highlight ? 'br2 b--blue b--dashed ba bg-light-blue o-50' : ''
        }`}
      />
    )
  }
}
