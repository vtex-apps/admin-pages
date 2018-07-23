import {ReactElement, Component} from "react"

declare global {
  declare module '*.graphql' {
    import {DocumentNode} from 'graphql';

    const value: DocumentNode;
    export default value;
  }

  interface Extension {
    component: string | null
    props?: any
    shouldRender?: boolean
  }

  interface Extensions {
    [name: string]: Extension
  }

  interface Template {
    id: string
    context: string
  }

  interface Page {
    name: string
    conditions: string[]
    template: string
    device: string
    params: Record<string, any>
  }

  interface Route {
    id: string
    path: string
    context: string
    cname?: string
    params?: any
    disableExternals?: string[]
    declarer: string
    title?: string
    pages: Page[]
  }

  interface Routes {
    [name: string]: Route
  }

  interface RenderContext {
    account: RenderRuntime['account'],
    components: RenderRuntime['components'],
    culture: RenderRuntime['culture'],
    device: ConfigurationDevice,
    emitter: RenderRuntime['emitter'],
    extensions: RenderRuntime['extensions'],
    fetchComponent: (component: string) => Promise<void>,
    getSettings: (app: string) => any,
    history: History | null,
    navigate: (options: NavigateOptions) => boolean,
    onPageChanged: (location: Location) => void,
    page: RenderRuntime['page'],
    pages: RenderRuntime['pages'],
    prefetchPage: (name: string) => Promise<void>,
    production: RenderRuntime['production'],
    setDevice: (device: ConfigurationDevice) => void,
    updateComponentAssets: (availableComponents: Components) => void,
    updateExtension: (name: string, extension: Extension) => void,
    updateRuntime: (options?: PageContextOptions) => Promise<void>,
    workspace: RenderRuntime['workspace'],
  }

  interface RenderContextProps {
    runtime: RenderContext
  }

  type ConditionType = 'scope' | 'device' | 'custom'

  interface Condition {
    id: string
    type: ConditionType
    message: string
    multiple: boolean,
  }

  interface ConditionsCondition {
    conditionId: string
  }

  type Viewport = 'desktop' | 'mobile' | 'tablet'

  type ConfigurationDevice = 'any' | 'desktop' | 'mobile'

  type ConfigurationScope = 'url' | 'route' | 'site'

  interface EditorConditionSection {
    conditions: Condition[] | ConditionsCondition[]
    activeConditions: string[]
    addCondition: (conditionId: string) => void
    removeCondition?: (conditionId: string) => void
  }

  interface EditorContext extends EditorConditionSection {
    anyMatch: boolean
    editMode: boolean
    editTreePath: string | null
    highlightTreePath: string | null
    scope: ConfigurationScope
    viewport: Viewport
    setDevice: (device: ConfigurationDevice) => void
    setScope: (scope: ConfigurationScope) => void
    setViewport: (viewport: Viewport) => void
    editExtensionPoint: (treePath: string | null) => void
    mouseOverExtensionPoint: (treePath: string | null) => void
    toggleEditMode: () => void
  }

  interface EditorContextProps {
    editor: EditorContext
  }

  interface RenderRuntime {
    account: string
    accountId: string
    appsEtag: string
    customRouting?: boolean
    emitter: EventEmitter
    workspace: string
    disableSSR: boolean
    hints: any
    page: string
    version: string
    culture: Culture
    pages: Routes
    routes: Routes
    extensions: Extensions
    production: boolean
    publicEndpoint: string
    messages: Record<string, string>
    components: Components | Record<string, string[]>
    renderMajor: number
    query?: Record<string, string>
    start: boolean
    settings: {
      [app: string]: any;
    }
    cacheHints: CacheHints
  }

  interface PageContextOptions {
    scope?: ConfigurationScope
    device?: ConfigurationDevice
    conditions?: string[]
    template?: string
  }
}
