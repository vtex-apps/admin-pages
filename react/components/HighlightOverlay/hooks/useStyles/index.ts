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
  visibleElement,
}) => {
  const updateStyles = useCallback(
    (mutationList?: MutationRecord[]) => {
      let elementHeight: HTMLElement['clientHeight']

      if (mutationList) {
        const { target } = mutationList[0]

        if (target instanceof HTMLElement) {
          elementHeight = target.clientHeight
        }
      }

      const styles = getStyles({
        hasValidElement,
        highlightTreePath,
        visibleElement,
      })

      setState(state => ({ ...state, ...styles, elementHeight }))
    },
    [hasValidElement, highlightTreePath, setState, visibleElement]
  )

  useEffect(() => {
    if (isOverlayMaskActive && visibleElement) {
      const observer = new MutationObserver(updateStyles)

      observer.observe(visibleElement, {
        attributes: true,
      })

      return () => {
        observer.disconnect()
      }
    } else {
      updateStyles()

      return () => {}
    }
  }, [isOverlayMaskActive, updateStyles, visibleElement])
}

export default useStyles
