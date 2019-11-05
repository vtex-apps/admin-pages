import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { canUseDOM } from 'vtex.render-runtime'

import useAutoScroll from './hooks/useAutoScroll'
import useHighlightOnHover from './hooks/useHighlightOnHover'
import useHighlightedElementInfo from './hooks/useHighlightedElementInfo'
import usePortal from './hooks/usePortal'
import useResizeObserver from './hooks/useResizeObserver'
import useStyles from './hooks/useStyles'
import OverlayMask from './OverlayMask'
import { State } from './typings'

import styles from './HighlightOverlay.css'

interface Props {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
}

const classNames = {
  enter: styles['highlight-enter'],
  enterActive: styles['highlight-enter-active'],
  enterDone: styles['highlight-enter-done'],
  exit: styles['highlight-exit'],
  exitActive: styles['highlight-exit-active'],
  exitDone: styles['highlight-exit-done'],
}

const HighlightOverlay: React.FC<Props> = props => {
  const [state, setState] = React.useState<State>(() => ({
    editExtensionPoint: props.editExtensionPoint,
    editMode: props.editMode,
    highlightHandler: props.highlightHandler,
    highlightTreePath: props.highlightTreePath,
    openBlockTreePath: null,
    sidebarBlocksMap: {},
  }))

  const {
    editMode,
    highlightTreePath,
    openBlockTreePath,
    sidebarBlocksMap,
  } = state

  const { subscribeToResize, unsubscribeToResize } = useResizeObserver()

  const portalContainer = usePortal({ subscribeToResize, unsubscribeToResize })

  useHighlightOnHover(state)

  React.useEffect(() => {
    const highlightableWindow = window

    if (canUseDOM) {
      highlightableWindow.__setHighlightTreePath = (
        newState: Partial<State>
      ) => {
        setState(prevState => {
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
  }, [setState])

  const titleTreePath = highlightTreePath || openBlockTreePath

  const { visibleElement, hasValidElement } = useHighlightedElementInfo(
    titleTreePath,
    sidebarBlocksMap,
    state.elementHeight
  ) || { visibleElement: undefined, hasValidElement: false }

  useAutoScroll({ editMode, highlightTreePath, visibleElement })

  const isOverlayMaskActive = Boolean(
    hasValidElement && openBlockTreePath && portalContainer
  )

  useStyles({
    hasValidElement,
    highlightTreePath: titleTreePath,
    isOverlayMaskActive,
    setState,
    subscribeToResize,
    unsubscribeToResize,
    visibleElement,
  })

  const hasHighlight = highlightTreePath && hasValidElement

  const title =
    titleTreePath &&
    sidebarBlocksMap[titleTreePath] &&
    sidebarBlocksMap[titleTreePath].title

  return (
    <>
      <CSSTransition
        in={
          Boolean(hasValidElement && hasHighlight) ||
          Boolean(hasValidElement && openBlockTreePath)
        }
        classNames={classNames}
        mountOnEnter
        timeout={150}
      >
        <div
          id="editor-provider-overlay"
          style={state.highlightStyle}
          className="absolute bw2 ba"
        >
          {title && (
            <p
              className="absolute white f7 ma0 right-0 ph2 pb2 pt1 truncate tc"
              style={state.labelStyle}
              title={title}
            >
              {title}
            </p>
          )}
        </div>
      </CSSTransition>
      {ReactDOM.createPortal(
        <OverlayMask style={state.maskStyle} isActive={isOverlayMaskActive} />,
        portalContainer
      )}
    </>
  )
}

export default HighlightOverlay
