import debounce from 'lodash/debounce'
import React, { Component, CSSProperties } from 'react'
import ReactDOM from 'react-dom'
import observeResize from 'simple-element-resize-detector'
import { canUseDOM } from 'vtex.render-runtime'

let DEFAULT_HIGHLIGHT_RECT = { x: 0, y: 0, width: 0, height: 0 }

const HIGHLIGHT_REMOVAL_TIMEOUT_MS = 300

interface Props {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
}

export interface State {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  openBlockTreePath: string | null
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
  sidebarBlocksMap: Record<string, { title?: string; isEditable: boolean }>
}

function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function isElementInHorizontalAxis(el: Element) {
  const rect = el.getBoundingClientRect()

  return (
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export class HighlightOverlay extends Component<Props, State> {
  public highlightRemovalTimeout: ReturnType<Window['setTimeout']> | null
  private portalContainer: HTMLDivElement
  private portalRoot: HTMLDivElement | null
  private resizeDetector?: HTMLIFrameElement
  private hasValidElement = false

  private INITIAL_HIGHLIGHT_RECT = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  }

  private debouncedScrollTo = debounce((element: Element) => {
    if (!isElementInViewport(element)) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }, 75)

  public constructor(props: Props) {
    super(props)

    this.state = {
      editExtensionPoint: props.editExtensionPoint,
      editMode: props.editMode,
      highlightHandler: props.highlightHandler,
      highlightTreePath: props.highlightTreePath,
      openBlockTreePath: null,
      sidebarBlocksMap: {},
    }

    this.portalContainer = document.createElement<'div'>('div')
    this.portalContainer.setAttribute('class', 'absolute z-9999')
    this.portalRoot = document.querySelector<HTMLDivElement>('.render-provider')

    const highlightableWindow = window

    if (canUseDOM) {
      highlightableWindow.__setHighlightTreePath = (
        newState: Partial<State>
      ) => {
        this.setState(prevState => {
          return {
            ...prevState,
            ...newState,
            sidebarBlocksMap: {
              ...prevState.sidebarBlocksMap,
              ...newState.sidebarBlocksMap,
            },
          }
        })
      }
    }

    this.highlightRemovalTimeout = null
  }

  private mountPortalRoot() {
    if (this.portalRoot) {
      const rootComputedStyle = window.getComputedStyle(this.portalRoot)
      this.portalContainer.setAttribute(
        'style',
        `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
      )
      this.portalRoot.prepend(this.portalContainer)
      this.resizeDetector = observeResize(this.portalRoot, () => {
        if (this.portalRoot) {
          const rootComputedStyle = window.getComputedStyle(this.portalRoot)
          this.portalContainer.setAttribute(
            'style',
            `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
          )
        }
      })
    }
  }

  private unmountPortalRoot() {
    if (this.resizeDetector && this.resizeDetector.parentNode) {
      this.resizeDetector.parentNode.removeChild(this.resizeDetector)
    }
    if (this.portalRoot) {
      this.portalRoot.removeChild(this.portalContainer)
    }
  }

  public componentDidMount() {
    this.mountPortalRoot()
  }

  public componentWillUnmount() {
    this.unmountPortalRoot()
  }

  public componentDidUpdate() {
    this.updateExtensionPointDOMElements(this.state.editMode)

    if (this.state.highlightTreePath === null) {
      this.debouncedScrollTo.cancel()
    }
  }

  public updateExtensionPointDOMElements = (editMode: boolean) => {
    const elements = Array.from(
      document.querySelectorAll(`[data-extension-point]`)
    )
    elements.forEach((e: Element) => {
      const element = e as HTMLElement
      if (editMode) {
        element.addEventListener('mouseover', this.handleMouseOverHighlight)
        element.addEventListener('mouseleave', this.handleMouseLeaveHighlight)
        element.addEventListener('click', this.handleClickHighlight)
        element.style.cursor = 'pointer'
      } else {
        element.removeEventListener('mouseover', this.handleMouseOverHighlight)
        element.removeEventListener(
          'mouseleave',
          this.handleMouseLeaveHighlight
        )
        element.removeEventListener('click', this.handleClickHighlight)
        element.style.cursor = 'default'
      }
    })
  }

  public getHighlightRect = (highlightTreePath: string) => {
    const elements = document.querySelectorAll(
      `[data-extension-point="${highlightTreePath}"]`
    )

    const provider = document.querySelector<HTMLDivElement>('.render-provider')

    const iframeBody = document.querySelector('body')

    const elementsArray: Element[] = Array.prototype.slice.call(elements)

    const visibleElement = elementsArray.find(currElement => {
      const currRect = currElement.getBoundingClientRect()

      return (
        currRect.width > 0 &&
        currRect.height > 0 &&
        isElementInHorizontalAxis(currElement)
      )
    })

    const isEditable =
      this.state.sidebarBlocksMap[highlightTreePath] &&
      this.state.sidebarBlocksMap[highlightTreePath].isEditable

    this.hasValidElement = !(
      !highlightTreePath ||
      elements.length === 0 ||
      !visibleElement ||
      !isEditable ||
      !provider
    )

    if (!this.hasValidElement) {
      return
    }

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

    const providerRect = (provider &&
      (provider.getBoundingClientRect() as DOMRect)) || { x: 0, y: 0 }

    const rect = visibleElement
      ? (visibleElement.getBoundingClientRect() as DOMRect)
      : this.INITIAL_HIGHLIGHT_RECT

    if (visibleElement && !this.state.editMode) {
      this.debouncedScrollTo(visibleElement)
    }

    // Add offset from render provider main div
    rect.y += -providerRect.y
    rect.x +=
      -providerRect.x +
      (paddingFromIframeBody.left + paddingFromIframeBody.right) / 2

    DEFAULT_HIGHLIGHT_RECT = rect

    return rect
  }

  public handleMouseOverHighlight: EventListener = e => {
    if (
      !e.currentTarget ||
      !(e.currentTarget instanceof HTMLElement) ||
      !this.highlightRemovalTimeout
    ) {
      return
    }

    const treePath = e.currentTarget.getAttribute('data-extension-point')
    const isEditable =
      treePath &&
      this.state.sidebarBlocksMap[treePath] &&
      this.state.sidebarBlocksMap[treePath].isEditable

    if (isEditable) {
      this.state.highlightHandler(treePath)
    }

    clearTimeout(this.highlightRemovalTimeout)
    e.stopPropagation()
  }

  public handleMouseLeaveHighlight = () => {
    if (this.highlightRemovalTimeout) {
      clearTimeout(this.highlightRemovalTimeout)
    }

    this.highlightRemovalTimeout = window.setTimeout(
      this.tryRemoveHighlight,
      HIGHLIGHT_REMOVAL_TIMEOUT_MS
    )
  }

  public tryRemoveHighlight = () => {
    this.state.highlightHandler(null)
  }

  public handleClickHighlight = (e: Event) => {
    if (!e.currentTarget) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    const { highlightTreePath } = this.state
    this.state.editExtensionPoint(highlightTreePath)
    this.state.highlightHandler(null)
  }

  public render() {
    const {
      highlightTreePath,
      openBlockTreePath,
      sidebarBlocksMap,
    } = this.state
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
      transition: 'opacity 100ms ease-out',
      width,
      zIndex: 9999,
    }

    const titleTreePath = highlightTreePath || openBlockTreePath
    const title =
      titleTreePath &&
      sidebarBlocksMap[titleTreePath] &&
      sidebarBlocksMap[titleTreePath].title

    const startX = `${highlightStyle.left}px`
    const endX = `${Number(highlightStyle.left) +
      Number(highlightStyle.width)}px`

    const startY = `${highlightStyle.top}px`
    const endY = `${Number(highlightStyle.top) +
      Number(highlightStyle.height)}px`

    const isBlockWidthSmaller = width < 98 * 1.25
    const isBlockHeightSmaller = height < 26

    return (
      <>
        <div
          id="editor-provider-overlay"
          style={highlightStyle}
          className={`absolute b--action-primary bw2 ba ${
            this.hasValidElement && (highlight || openBlockTreePath)
              ? 'o-100'
              : 'o-0'
          }`}
        >
          {title && (
            <p
              className="absolute bg-action-primary c-action-secondary f7 ma0 right-0 ph2 pb2 pt1 truncate tc"
              style={{
                width: 90,
                height: 20,
                transform: `${
                  isBlockHeightSmaller || isBlockWidthSmaller
                    ? 'translate(4px, -24px)'
                    : ''
                }`,
              }}
              title={title}
            >
              {title}
            </p>
          )}
        </div>
        {this.hasValidElement &&
          openBlockTreePath &&
          this.portalContainer &&
          ReactDOM.createPortal(
            <div
              className="absolute bg-base h-100 w-100 o-40"
              style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${startX} 100%, ${startX} ${startY}, ${endX} ${startY}, ${endX} ${endY}, ${startX} ${endY}, ${startX} 100%, 100% 100%, 100% 0%)`,
              }}
            />,
            this.portalContainer
          )}
      </>
    )
  }
}

export default HighlightOverlay
