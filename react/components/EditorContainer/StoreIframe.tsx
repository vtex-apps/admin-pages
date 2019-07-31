import React, { useEffect, useRef } from 'react'

interface Props {
  path?: string
}

const StoreIframe: React.FunctionComponent<Props> = React.memo(({ path }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
      const oldLog = iframeRef.current.contentWindow.console.log
      const oldError = iframeRef.current.contentWindow.console.error
      iframeRef.current.contentWindow.console.log = function newLog() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldLog.apply(this, arguments)
      }

      iframeRef.current.contentWindow.console.error = function newError() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldError.apply(this, arguments)
      }
    }
  }, [])

  return (
    <iframe
      id="store-iframe"
      className="w-100 h-100"
      ref={iframeRef}
      src={path ? `/${path}` : '/'}
      frameBorder="0"
    />
  )
})

export default StoreIframe
