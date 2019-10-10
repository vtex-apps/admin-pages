import observeResize from 'simple-element-resize-detector'
import { useEffect, useRef } from 'react'

export default function usePortal() {
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

    const resizeDetector =
      portalRoot &&
      observeResize(portalRoot, () => {
        if (portalRoot) {
          const rootComputedStyle = window.getComputedStyle(portalRoot)
          portalContainer.setAttribute(
            'style',
            `width: ${rootComputedStyle.width}; height: ${rootComputedStyle.height}; pointer-events: none;`
          )
        }
      })

    return () => {
      if (resizeDetector && resizeDetector.parentNode) {
        resizeDetector.parentNode.removeChild(resizeDetector)
      }
      if (portalRoot) {
        portalRoot.removeChild(portalContainer)
      }
    }
  }, [])

  return portalContainerRef.current
}
