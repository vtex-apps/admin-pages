import { useCallback, useEffect } from 'react'

import { UseStyles } from './typings'
import { getStyles } from './utils'

/*
 * The "data-extension-point" attribute is re-added to the element every
 * time it's edited. By observing it, we can consistently check if the
 * block's automatic height has changed and adapt the HighlightOverlay's
 * height accordingly.
 */

const useStyles: UseStyles = ({
  hasValidElement,
  highlightTreePath,
  isOverlayMaskActive,
  setState,
  subscribeToResize,
  unsubscribeToResize,
  visibleElement,
}) => {
  const updateStyles = useCallback(
    (clientHeight?) => {
      const elementHeight: HTMLElement['clientHeight'] = clientHeight

      const styles = getStyles({
        hasValidElement,
        highlightTreePath,
        visibleElement,
      })

      setState(state => ({
        ...state,
        ...styles,
        elementHeight: elementHeight || state.elementHeight,
      }))
    },
    [hasValidElement, highlightTreePath, setState, visibleElement]
  )

  useEffect(() => {
    function resizeCallback(element: Element) {
      updateStyles(element.clientHeight)
    }

    subscribeToResize(resizeCallback)
    updateStyles()

    return () => {
      unsubscribeToResize(resizeCallback)
    }
  }, [
    isOverlayMaskActive,
    subscribeToResize,
    unsubscribeToResize,
    updateStyles,
    visibleElement,
  ])
}

export default useStyles
