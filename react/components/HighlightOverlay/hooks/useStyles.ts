import { CSSProperties, useMemo } from 'react'

import { State } from '../typings'

interface UseStylesArgs {
  hasValidElement?: boolean
  highlightTreePath: State['highlightTreePath']
  visibleElement?: Element
}

let DEFAULT_HIGHLIGHT_RECT = { x: 0, y: 0, width: 0, height: 0 }

const INITIAL_HIGHLIGHT_RECT = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
}

const BLUE = '#134CD8'

function getHighlightRect(visibleElement?: Element) {
  const provider = document.querySelector<HTMLDivElement>('.render-provider')

  const iframeBody = document.querySelector('body')

  const paddingFromIframeBody = iframeBody
    ? {
        left: parseInt(
          window.getComputedStyle(iframeBody, null).paddingLeft || '0',
          10
        ),
        right: parseInt(
          window.getComputedStyle(iframeBody, null).paddingRight || '0',
          10
        ),
      }
    : {
        left: 0,
        right: 0,
      }

  const providerRect = (provider &&
    (provider.getBoundingClientRect() as DOMRect)) || { x: 0, y: 0 }

  const rect = visibleElement
    ? (visibleElement.getBoundingClientRect() as DOMRect)
    : INITIAL_HIGHLIGHT_RECT

  // Add offset from render provider main div
  rect.y += -providerRect.y
  rect.x +=
    -providerRect.x +
    (paddingFromIframeBody.left + paddingFromIframeBody.right) / 2

  DEFAULT_HIGHLIGHT_RECT = rect

  return rect
}

export default function useStyles({
  hasValidElement,
  highlightTreePath,
  visibleElement,
}: UseStylesArgs) {
  return useMemo(() => {
    const highlight =
      highlightTreePath && hasValidElement && getHighlightRect(visibleElement)

    const { x: left, y: top, width, height } =
      highlight || DEFAULT_HIGHLIGHT_RECT

    const isBlockWidthSmaller = width < 98 * 1.25
    const isBlockHeightSmaller = height < 26

    const highlightStyle: CSSProperties = {
      animationDuration: '0.6s',
      borderColor: BLUE,
      height: !isBlockHeightSmaller && top - 4 < 0 ? height : height + 8,
      left:
        !isBlockWidthSmaller && width >= document.body.scrollWidth
          ? left
          : left - 4,
      pointerEvents: 'none',
      top: !isBlockHeightSmaller && top - 4 < 0 ? top : top - 4,
      transition: 'opacity 100ms ease-out',
      width:
        !isBlockWidthSmaller && width >= document.body.scrollWidth
          ? document.body.scrollWidth
          : width + 8,
      zIndex: 9999,
    }

    const startX = `${highlightStyle.left}px`
    const endX = `${Number(highlightStyle.left) +
      Number(highlightStyle.width)}px`

    const startY = `${highlightStyle.top}px`
    const endY = `${Number(highlightStyle.top) +
      Number(highlightStyle.height)}px`

    const maskStyle = {
      clipPath:
        `polygon(0% 0%, 0% 100%, ${startX} 100%, ${startX} ${startY}, ${endX} ${startY}, ` +
        `${endX} ${endY}, ${startX} ${endY}, ${startX} 100%, 100% 100%, 100% 0%)`,
    }

    const labelStyle = {
      backgroundColor: BLUE,
      width: 90,
      height: 20,
      transform: `${
        isBlockHeightSmaller || isBlockWidthSmaller
          ? 'translate(4px, -24px)'
          : ''
      }`,
    }

    return { maskStyle, labelStyle, highlightStyle }
  }, [hasValidElement, highlightTreePath, visibleElement])
}
