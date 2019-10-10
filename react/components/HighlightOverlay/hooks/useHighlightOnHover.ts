import { useCallback, useEffect, useRef } from 'react'
import { State } from '../typings'

const HIGHLIGHT_REMOVAL_TIMEOUT_MS = 300

export default function useHighlightOnHover({
  editMode,
  editExtensionPoint,
  highlightHandler,
  highlightTreePath,
  sidebarBlocksMap,
}: State) {
  const highlightRemovalTimeout = useRef<number | undefined>()
  const handleMouseOverHighlight = useCallback<EventListener>(
    e => {
      if (
        !e.currentTarget ||
        !(e.currentTarget instanceof HTMLElement) ||
        !highlightRemovalTimeout.current
      ) {
        return
      }

      const treePath = e.currentTarget.getAttribute('data-extension-point')
      const isEditable =
        treePath &&
        sidebarBlocksMap[treePath] &&
        sidebarBlocksMap[treePath].isEditable

      if (isEditable) {
        highlightHandler(treePath)
      }

      clearTimeout(highlightRemovalTimeout.current)
      e.stopPropagation()
    },
    [highlightHandler, sidebarBlocksMap]
  )

  const handleMouseLeaveHighlight = useCallback<EventListener>(() => {
    if (highlightRemovalTimeout.current) {
      clearTimeout(highlightRemovalTimeout.current)
    }

    highlightRemovalTimeout.current = window.setTimeout(() => {
      highlightHandler(null)
    }, HIGHLIGHT_REMOVAL_TIMEOUT_MS)
  }, [highlightHandler])

  const handleClickHighlight = useCallback<EventListener>(
    e => {
      if (!e.currentTarget) {
        return
      }

      e.preventDefault()
      e.stopPropagation()
      editExtensionPoint(highlightTreePath)
      highlightHandler(null)
    },
    [editExtensionPoint, highlightHandler, highlightTreePath]
  )

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll(`[data-extension-point]`)
    )
    if (editMode) {
      elements.forEach((e: Element) => {
        const element = e as HTMLElement
        if (editMode) {
          element.addEventListener('mouseover', handleMouseOverHighlight)
          element.addEventListener('mouseleave', handleMouseLeaveHighlight)
          element.addEventListener('click', handleClickHighlight)
          element.style.cursor = 'pointer'
        }
      })
    }

    return () => {
      if (editMode) {
        elements.forEach((e: Element) => {
          const element = e as HTMLElement
          element.removeEventListener('mouseover', handleMouseOverHighlight)
          element.removeEventListener('mouseleave', handleMouseLeaveHighlight)
          element.removeEventListener('click', handleClickHighlight)
          element.style.cursor = 'default'
        })
      }
    }
  }, [
    handleMouseOverHighlight,
    editMode,
    handleMouseLeaveHighlight,
    handleClickHighlight,
  ])
}
