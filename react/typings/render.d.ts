declare module 'render' {
  import {ReactElement, Component} from "react"

  var ExtensionPoint: ReactElement
  var Link: ReactElement
  var NoSSR: ReactElement
  var RenderContextConsumer: ReactElement
  var canUseDOM: boolean

  export {
    canUseDOM,
    ExtensionPoint,
    Link,
    NoSSR,
    RenderContextConsumer,
  }
}
