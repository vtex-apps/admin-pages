import { ReactElement, Component } from 'react'
import { State as HighlightOverlayState } from '../HighlightOverlay'
declare global {
  declare module '*.graphql' {
    import { DocumentNode } from 'graphql'

    const value: DocumentNode
    export default value
  }

  interface Extension {
    component: string | null
    configurationsIds?: string[]
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
    configurationId: string
  }

  interface Route {
    id: string
    path: string
    context: string
    login: boolean | null
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
    account: RenderRuntime['account']
    components: RenderRuntime['components']
    culture: RenderRuntime['culture']
    device: ConfigurationDevice
    emitter: RenderRuntime['emitter']
    extensions: RenderRuntime['extensions']
    fetchComponent: (component: string) => Promise<void>
    getSettings: (app: string) => any
    history: History | null
    navigate: (options: NavigateOptions) => boolean
    onPageChanged: (location: Location) => void
    page: RenderRuntime['page']
    pageContext: RenderRuntime['pageContext']
    pages: RenderRuntime['pages']
    prefetchPage: (name: string) => Promise<void>
    production: RenderRuntime['production']
    setDevice: (device: ConfigurationDevice) => void
    updateComponentAssets: (availableComponents: Components) => void
    updateExtension: (name: string, extension: Extension) => void
    updateRuntime: (options?: PageContextOptions) => Promise<void>
    workspace: RenderRuntime['workspace']
  }

  interface RenderContextProps {
    runtime: RenderContext
  }

  interface Condition {
    conditionId: string
  }

  type Viewport = 'desktop' | 'mobile' | 'tablet'

  type ConfigurationDevice = 'any' | 'desktop' | 'mobile'

  interface EditorConditionSection {
    activeConditions: string[]
    conditions: Condition[]
    addCondition: (conditionId: string) => void
    removeCondition?: (conditionId: string) => void
  }

  interface EditorContext extends EditorConditionSection {
    allMatches: boolean
    editMode: boolean
    editTreePath: string | null
    iframeWindow: Window
    viewport: Viewport
    setDevice: (device: ConfigurationDevice) => void
    setViewport: (viewport: Viewport) => void
    editExtensionPoint: (treePath: string | null) => void
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
    pageContext: PageContext
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
      [app: string]: any
    }
    cacheHints: CacheHints
  }

  interface PageContextOptions {
    device?: ConfigurationDevice
    conditions?: string[]
    template?: string
  }

  interface PageContext {
    id: string
    type:
      | 'brand'
      | 'category'
      | 'department'
      | 'product'
      | 'search'
      | 'subcategory'
      | 'url'
  }

  interface ExtensionConfiguration {
    allMatches: boolean
    conditions: string[]
    configurationId: string
    device: string
    label?: string
    pageContext?: RenderRuntime['pageContext']
    propsJSON: string
    routeId: string
  }

  type ConfigurationScope = 'routeGeneric' | 'routeSpecific' | 'url'

  type ComponentEditorMode = 'content' | 'layout'

  interface Redirect {
    cacheId: string
    disabled: boolean
    endDate: string
    from: string
    id: string
    to: string
  }

  interface HighlightableIFrame extends HTMLIFrameElement {
    contentWindow: ContentWindow | null
  }

  interface HighlightableWindow extends Window {
    __setHighlightTreePath: (HighlightOverlayState) => void
  }

  interface ComponentSchemaProperties {
      [key: string]: ComponentSchema
  }

  interface ComponentSchema {
    type?: string
    title?: string
    description?: string
    enumNames?: any
    widget?: any
    items?: any
    minItems?: number
    properties?: ComponentSchemaProperties
  }

  type UISchema = any

  interface Window {
    __provideRuntime?: (
      runtime: RenderContext,
      messages?: Record<string, string>,
      shouldUpdateRuntime?: boolean
    ) => void
  }
}
