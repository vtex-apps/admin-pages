import debounce from 'lodash/debounce'
import { useEffect } from 'react'
import { State } from '../typings'

interface UseAutoScrollArgs {
  highlightTreePath: State['highlightTreePath']
  editMode: State['editMode']
  visibleElement?: Element
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

const scrollToElement = debounce((element: Element) => {
  if (!isElementInViewport(element)) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
}, 75)

export default function useAutoScroll({
  highlightTreePath,
  editMode,
  visibleElement,
}: UseAutoScrollArgs) {
  useEffect(() => {
    if (visibleElement && !editMode) {
      scrollToElement(visibleElement)
    }
  }, [visibleElement, editMode])

  useEffect(() => {
    if (highlightTreePath === null) {
      scrollToElement.cancel()
    }
  }, [highlightTreePath])
}
