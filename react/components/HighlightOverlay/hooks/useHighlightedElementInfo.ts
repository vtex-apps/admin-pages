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

  const viewportMiddle =
    (window.innerWidth || document.documentElement.clientWidth) / 2

  const visibleElementsClosestToMiddle = elementsArray
    .filter(currElement => {
      const currRect = currElement.getBoundingClientRect()

      return (
        currRect.width > 0 &&
        currRect.height > 0 &&
        isElementInHorizontalAxis(currElement)
      )
    })
    .sort((elemA, elemB) => {
      const rectA = elemA.getBoundingClientRect()
      const rectB = elemB.getBoundingClientRect()
      const middleA = rectA.left || 0 + rectA.width
      const middleB = rectB.left || 0 + rectB.width

      const differenceA =
        viewportMiddle - middleA < 0
          ? middleA - viewportMiddle
          : viewportMiddle - middleA
      const differenceB =
        viewportMiddle - middleB < 0
          ? middleB - viewportMiddle
          : viewportMiddle - middleB

      if (differenceA < differenceB) {
        return -1
      } else if (differenceA > differenceB) {
        return 1
      }
      return 0
    })

  const visibleElement = visibleElementsClosestToMiddle[0]

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
  sidebarBlocksMap: State['sidebarBlocksMap'],
  elementHeight: State['elementHeight']
) {
  return useMemo<Partial<ReturnType<typeof getElementInfo>>>(() => {
    return (
      (highlightTreePath &&
        getElementInfo(highlightTreePath, sidebarBlocksMap)) ||
      {}
    )
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [highlightTreePath, sidebarBlocksMap, elementHeight])
  /* eslint-enable react-hooks/exhaustive-deps */
}
