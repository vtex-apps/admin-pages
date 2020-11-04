import React, { useEffect, useRef } from 'react'

interface Props {
  path?: string
}

const StoreIframe: React.FunctionComponent<Props> = ({ path }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
      const oldLog = (iframeRef.current.contentWindow as any).console.log
      const oldError = ((iframeRef.current.contentWindow as any).console.error(
        iframeRef.current.contentWindow as any
      ).console.log = function newLog() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldLog.apply(this, arguments)
      })
      ;((iframeRef.current
        .contentWindow as unknown) as any).console.error = function newError() {
        Array.prototype.unshift.call(arguments, `[Iframe]: `)
        oldError.apply(this, arguments)
      }
    }
  }, [])

  return (
    <iframe
      className="w-100 h-100"
      frameBorder="0"
      id="store-iframe"
      ref={iframeRef}
      src={path ? `/${path}` : '/'}
      title="store-iframe"
    />
  )
}

export default React.memo(StoreIframe)
