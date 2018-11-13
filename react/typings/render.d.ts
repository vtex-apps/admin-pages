/* Typings for `render-runtime` */
declare module 'render' {
  import {ReactElement, Component} from "react"

  export const ExtensionPoint: ReactElement
  export const Link: ReactElement
  export const NoSSR: ReactElement
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean
  export const withRuntimeContext: <TOriginalProps extends {}>(Component: ComponentType<TOriginalProps & RenderContextProps>) => ComponentType<TOriginalProps>

  interface RenderComponent<P={}, S={}> extends Component<P,S> {
    getCustomMessages?: (locale: string) => any
    schema: ComponentSchema
    getSchema?: (any, any?) => ComponentSchema
    uiSchema: UISchema
  }

  export interface ComponentsRegistry {
    [component: string]: RenderComponent<any,any>
  }

  export interface Window extends Window {
    __RENDER_7_COMPONENTS__: ComponentsRegistry
  }

  var global: Window
}
