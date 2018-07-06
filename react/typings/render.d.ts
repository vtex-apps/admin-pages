declare module 'render' {
  import {ReactElement, Component} from "react"

  var ExtensionPoint: ReactElement
  var NoSSR: ReactElement
  var RenderContextConsumer: ReactElement

  export {
    ExtensionPoint,
    NoSSR,
    RenderContextConsumer,
  }
}
