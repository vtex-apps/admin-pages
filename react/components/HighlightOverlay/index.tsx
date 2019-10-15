import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { canUseDOM } from 'vtex.render-runtime'
import useAutoScroll from './hooks/useAutoScroll'
import useHighlightOnHover from './hooks/useHighlightOnHover'
import usePortal from './hooks/usePortal'
import useStyles from './hooks/useStyles'
import useHighlightedElementInfo from './hooks/useHighlightedElementInfo'
import OverlayMask from './OverlayMask'
import { State } from './typings'

import styles from './HighlightOverlay.css'

interface Props {
  editExtensionPoint: (treePath: string | null) => void
  editMode: boolean
  highlightHandler: (treePath: string | null) => void
  highlightTreePath: string | null
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

  const portalContainer = usePortal()

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
    sidebarBlocksMap
  ) || { visibleElement: undefined, hasValidElement: false }

  useAutoScroll({ editMode, highlightTreePath, visibleElement })

  const { highlightStyle, labelStyle, maskStyle } = useStyles({
    hasValidElement,
    highlightTreePath: titleTreePath,
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
        in={Boolean((hasValidElement && hasHighlight) || openBlockTreePath)}
        classNames={{
          enter: styles['highlight-enter'],
          enterActive: styles['highlight-enter-active'],
          enterDone: styles['highlight-enter-done'],
          exit: styles['highlight-exit'],
          exitActive: styles['highlight-exit-active'],
          exitDone: styles['highlight-exit-done'],
        }}
        mountOnEnter
        timeout={150}
      >
        <div
          id="editor-provider-overlay"
          style={highlightStyle}
          className="absolute bw2 ba"
        >
          {title && (
            <p
              className="absolute c-action-secondary f7 ma0 right-0 ph2 pb2 pt1 truncate tc"
              style={labelStyle}
              title={title}
            >
              {title}
            </p>
          )}
        </div>
      </CSSTransition>
      {ReactDOM.createPortal(
        <OverlayMask
          style={maskStyle}
          isActive={Boolean(
            hasValidElement && openBlockTreePath && portalContainer
          )}
        />,
        portalContainer
      )}
    </>
  )
}

export default HighlightOverlay
