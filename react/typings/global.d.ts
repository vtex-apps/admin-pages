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

  interface Page {
    cname?: string
    path: string
    auth?: boolean
    params?: any
    theme?: string
    disableExternals?: string[]
    declarer: string
    name: string
    title?: string
  }

  interface Pages {
    [name: string]: Page
  }

  interface RenderContext {
    account: RenderRuntime['account'],
    components: RenderRuntime['components'],
    culture: RenderRuntime['culture'],
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
    updateExtension: (name: string, extension: Extension) => void,
    updateRuntime: () => Promise<void>,
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

  type ConfigurationDevice = 'any' | 'desktop' | 'mobile'

  type ConfigurationScope = 'url' | 'route' | 'template' | 'site'

  interface EditorConditionSection {
    conditions: Condition[]
    activeConditions: string[]
    addCondition: (conditionId: string) => void
    removeCondition?: (conditionId: string) => void
  }

  interface EditorContext extends EditorConditionSection {
    anyMatch: boolean
    editMode: boolean
    editTreePath: string | null
    highlightTreePath: string | null
    device: ConfigurationDevice
    scope: ConfigurationScope
    setDevice: (device: ConfigurationDevice) => void
    setScope: (scope: ConfigurationScope) => void
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
    pages: Pages
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
}
