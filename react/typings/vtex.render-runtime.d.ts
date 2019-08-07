/* Typings for `render-runtime` */
declare module 'vtex.render-runtime' {
  import { Component, ComponentType, ReactElement } from 'react'

  export const ExtensionPoint: ReactElement
  export const Helmet: ComponentType<unknown>
  export const Link: ReactElement
  export const NoSSR: ReactElement
  export const RenderContextConsumer: ReactElement
  export const canUseDOM: boolean

  export const withRuntimeContext: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<
    Pick<
      TOriginalProps,
      Exclude<keyof TOriginalProps, keyof RenderContextProps>
    >
  >

  export declare const useRuntime: () => RenderContext

  interface RenderComponent {
    getCustomMessages?: (locale: string) => unknown
    schema?: ComponentSchema
    getSchema?: (props: object, otherArgs?: unknown) => ComponentSchema
    uiSchema?: object
  }

  export interface ComponentsRegistry {
    [component: string]: RenderComponent
  }

  export interface Window extends Window {
    __RENDER_8_COMPONENTS__: ComponentsRegistry
  }

  export const buildCacheLocator: (
    app: string,
    type: string,
    cacheId: string
  ) => string

  const global: Window
}
