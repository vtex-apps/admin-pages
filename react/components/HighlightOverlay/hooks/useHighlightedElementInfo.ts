import { useMemo } from 'react'
import { State } from '../typings'

function isElementInHorizontalAxis(el: Element) {
  const rect = el.getBoundingClientRect()

  return (
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function getElementInfo(
  highlightTreePath: string,
  sidebarBlocksMap: State['sidebarBlocksMap']
) {
  const elements = document.querySelectorAll(
    `[data-extension-point="${highlightTreePath}"]`
  )

  const provider = document.querySelector<HTMLDivElement>('.render-provider')

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
    sidebarBlocksMap[highlightTreePath] &&
    sidebarBlocksMap[highlightTreePath].isEditable

  const hasValidElement = !(
    !highlightTreePath ||
    elements.length === 0 ||
    !visibleElement ||
    !isEditable ||
    !provider
  )

  return { visibleElement, hasValidElement }
}

export default function useHighlightedElementInfo(
  highlightTreePath: State['highlightTreePath'],
  sidebarBlocksMap: State['sidebarBlocksMap']
) {
  return useMemo<Partial<ReturnType<typeof getElementInfo>>>(() => {
    return (
      (highlightTreePath &&
        getElementInfo(highlightTreePath, sidebarBlocksMap)) ||
      {}
    )
  }, [highlightTreePath, sidebarBlocksMap])
}
