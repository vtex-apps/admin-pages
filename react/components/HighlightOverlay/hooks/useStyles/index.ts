import { useCallback, useEffect } from 'react'
import observeResize from 'simple-element-resize-detector'

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
    const root = document.querySelector<HTMLBodyElement>('body')
    if (root) {
      root.setAttribute(
        'style',
        root.getAttribute('style') || '' + 'position: relative;'
      )
    }
    const resizeDetector =
      root &&
      observeResize(root, element => {
        updateStyles(element.clientHeight)
      })

    updateStyles()

    return () => {
      if (resizeDetector && resizeDetector.parentNode) {
        resizeDetector.parentNode.removeChild(resizeDetector)
      }
    }
  }, [isOverlayMaskActive, updateStyles, visibleElement])
}

export default useStyles
