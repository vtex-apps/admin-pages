import { Component, ReactElement } from 'react'
import { State as HighlightOverlayState } from '../HighlightOverlay'
declare global {
  declare module '*.graphql' {
    import { DocumentNode } from 'graphql'

    const value: DocumentNode
    export default value
  }

  declare module '*.css' {
    interface CssClasses {
      [cssClass: string]: string
    }
    const content: CssClasses
    export default content
  }

  interface Extension {
    after?: string[]
    around?: string[]
    before?: string[]
    blockId?: string
    blocks?: InnerBlock[]
    component: string | null
    configurationsIds?: string[]
    content: object
    implementationIndex: number
    implements: string[]
    props: object
    shouldRender?: boolean
  }

  interface Extensions {
    [name: string]: Extension
  }

  interface Template {
    id: string
  }

  interface ConditionStatementArg {
    subject: string
    verb: string
    objectJSON: string
  }

  interface ConditionArg {
    id?: string
    allMatches: boolean
    statements: ConditionStatementArg[]
  }

  interface Page {
    pageId?: string
    condition: ConditionArg
    template: string
  }

  interface Route {
    auth: boolean
    blockId: string
    context: string | null
    declarer: string | null
    domain: string
    interfaceId: string
    pages: Page[]
    path: string
    routeId: string
    title: string | null
    uuid?: string
  }

  interface Routes {
    [name: string]: Route
  }

  interface HistoryLocation {
    hash: string
    key: string
    pathname: string
    search: string
    state: {}
  }

  type RuntimeHistory = History & {
    block: (s: string) => () => void
    listen: (
      listenCb: (location: HistoryLocation, action: string) => void
    ) => () => void
    location: HistoryLocation
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
    history: RuntimeHistory | null
    navigate: (options: NavigateOptions) => boolean
    onPageChanged: (location: Location) => void
    page: RenderRuntime['page']
    pages: RenderRuntime['pages']
    prefetchPage: (name: string) => Promise<void>
    preview: RenderRuntime['preview']
    production: RenderRuntime['production']
    route: RenderRuntime['route']
    setDevice: (device: ConfigurationDevice) => void
    updateComponentAssets: (availableComponents: Components) => void
    updateExtension: (name: string, extension: Extension) => void
    updateRuntime: (options?: PageContextOptions) => Promise<void>
    workspace: RenderRuntime['workspace']
  }

  interface RenderContextProps {
    runtime: RenderContext
  }

  type ConditionType = 'scope' | 'device' | 'custom'

  interface Condition {
    conditionId: string
  }

  type Viewport = 'desktop' | 'mobile' | 'tablet'

  type ConfigurationDevice = 'any' | 'desktop' | 'mobile'

  type EditorMode = 'content' | 'layout'

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
    isNavigating: boolean
    mode: EditorMode
    viewport: Viewport
    setDevice: (device: ConfigurationDevice) => void
    setIsNavigating: (isNavigating: boolean) => void
    setMode: (mode: EditorMode) => void
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
    pages: Routes
    route: { pageContext: PageContext; path: string }
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
    preview?: boolean
  }

  type ConfigurationScope = 'entity' | 'template' | 'sitewide'

  interface PageContextOptions {
    scope?: ConfigurationScope
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
      | 'route'
      | 'search'
      | 'subcategory'
      | '*'
  }

  interface ExtensionConfiguration {
    condition: {
      allMatches: boolean
      id: string
      pageContext: RenderRuntime['route']['pageContext']
      statements: Array<{
        object: any
        subject: string
        verb: string
      }>
    }
    contentId: string
    contentJSON: string
    label?: string
  }

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
    isLayout?: boolean
  }

  type UISchema = any

  interface Window {
    __provideRuntime?: (
      runtime: RenderContext,
      messages?: Record<string, string>,
      shouldUpdateRuntime?: boolean
    ) => void
  }

  interface AdminContext {
    startLoading: () => void
    stopLoading: () => void
  }

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  interface FormattedBlock {
    id: Extension['blockId']
    role: 'AFTER' | 'AROUND' | 'BEFORE' | 'BLOCK' | 'TEMPLATE'
  }

  type BlockPath = FormattedBlock[]

  interface InnerBlock {
    blockId: string
    extensionPointId: string
  }
}
