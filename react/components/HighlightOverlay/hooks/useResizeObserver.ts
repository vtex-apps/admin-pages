import { useEffect, useCallback, useRef } from 'react'
import observeResize from 'simple-element-resize-detector'
import { isArray } from 'util'

type ResizeFn = (el: Element) => void

export default function useResizeObserver() {
  const callbacksRef = useRef<Set<ResizeFn>>(new Set())

  const subscribeToResize = useCallback((callbacks: ResizeFn | ResizeFn[]) => {
    const fns = isArray(callbacks) ? callbacks : [callbacks]
    fns.forEach(fn => {
      callbacksRef.current.add(fn)
    })
  }, [])

  const unsubscribeToResize = useCallback(
    (callbacks: ResizeFn | ResizeFn[]) => {
      const fns = isArray(callbacks) ? callbacks : [callbacks]
      fns.forEach(fn => {
        callbacksRef.current.delete(fn)
      })
    },
    []
  )

  useEffect(() => {
    const root = document.querySelector<HTMLBodyElement>('body')

    if (root) {
      const currentStyle = root.getAttribute('style') || ''
      const newStyle = currentStyle + 'position: relative;'
      root.setAttribute('style', newStyle)
    }

    const resizeDetector =
      root &&
      observeResize(root, element => {
        callbacksRef.current.forEach(fn => {
          fn(element)
        })
      })

    return () => {
      if (resizeDetector && resizeDetector.parentNode) {
        resizeDetector.parentNode.removeChild(resizeDetector)
      }

      if (root) {
        const currentStyle = root.getAttribute('style') || ''
        const newStyle = currentStyle.replace('position: relative;', '')

        if (!newStyle) {
          root.removeAttribute('style')
        } else {
          root.setAttribute('style', newStyle)
        }
      }
    }
  }, [])

  return { subscribeToResize, unsubscribeToResize }
}

export type ObserverReturnType = ReturnType<typeof useResizeObserver>
