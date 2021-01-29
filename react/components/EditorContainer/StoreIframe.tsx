import React, { useEffect, useRef } from 'react'

import { useBinding } from './Topbar/ContextSelectors/hooks/useBinding'

interface Props {
  path?: string
}

const StoreIframe: React.FunctionComponent<Props> = ({ path }) => {
  const [binding] = useBinding()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
      /* eslint-disable prefer-rest-params */
      const oldLog = (iframeRef.current.contentWindow as any).console.log
      const oldError = (iframeRef.current.contentWindow as any).console.error
      ;(iframeRef.current
        .contentWindow as any).console.log = function newLog() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldLog.apply(this, arguments)
      }
      ;(iframeRef.current
        .contentWindow as any).console.error = function newError() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldError.apply(this, arguments)
      }
    }
  }, [])

  const getJoiner = (src: string) => (src.includes('?') ? '&' : '?')

  let src = path ? `/${path}` : '/'

  if (window?.location.search && !src.includes(window.location.search)) {
    src = src + `${window.location.search}`
  }

  if (binding && !src.includes('__bindingAddress')) {
    console.log('PASSOU')
    src += `${getJoiner(src)}__bindingAddress=${binding.canonicalBaseAddress}`
  }

  if (!src.includes('__siteEditor')) {
    src += `${getJoiner(src)}__siteEditor=true`
  }

  return (
    <iframe
      className="w-100 h-100"
      frameBorder="0"
      id="store-iframe"
      ref={iframeRef}
      src={src}
      title="store-iframe"
    />
  )
}

export default React.memo(StoreIframe)
