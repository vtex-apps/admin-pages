import { useEffect, useRef } from 'react'
import { ObserverReturnType } from './useResizeObserver'

export default function usePortal({
  subscribeToResize,
  unsubscribeToResize,
}: ObserverReturnType) {
  const portalContainerRef = useRef<HTMLDivElement>(
    document.createElement<'div'>('div')
  )

  useEffect(() => {
    const portalContainer = portalContainerRef.current
    portalContainer.setAttribute('class', 'absolute z-9999')
    const portalRoot = document.querySelector<HTMLDivElement>(
      '.render-provider'
    )

    const rootComputedStyle = (portalRoot &&
      window.getComputedStyle(portalRoot)) || { height: 0, width: 0 }

    portalContainer.setAttribute(
      'style',
      `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
    )

    if (portalRoot) {
      portalRoot.prepend(portalContainer)
    }

    function resizeCallback() {
      if (portalRoot) {
        const rootComputedStyle = window.getComputedStyle(portalRoot)
        portalContainer.setAttribute(
          'style',
          `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
        )
      }
    }

    subscribeToResize(resizeCallback)

    function resizeOnLoad() {
      const rootComputedStyle = (portalRoot &&
        window.getComputedStyle(portalRoot)) || { height: 0, width: 0 }

      portalContainer.setAttribute(
        'style',
        `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
      )
    }

    window.addEventListener('load', resizeOnLoad)

    return () => {
      unsubscribeToResize(resizeCallback)

      if (portalRoot) {
        portalRoot.removeChild(portalContainer)
      }
      window.removeEventListener('load', resizeOnLoad)
    }
  }, [subscribeToResize, unsubscribeToResize])

  return portalContainerRef.current
}
