import { JSONSchema6 } from 'json-schema'

import { State as EditorProviderState } from '../components/EditorProvider'
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
    blockId: string
    blocks?: InnerBlock[]
    component: string | null
    composition?: 'blocks' | 'children'
    configurationsIds?: string[]
    content: Record<string, unknown>
    contentMapId?: string
    hasContentSchema: boolean
    implementationIndex?: number
    implements?: string[]
    preview: object | null
    props: Record<string, unknown>
    render: 'client' | 'lazy' | 'server'
    shouldRender?: boolean
    track: string[]
    title?: string
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

  interface PageMetaTags {
    description?: string
    keywords?: string[]
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
    metaTags?: PageMetaTags
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
    state: { navigationRoute: { params: {} } }
  }

  type RuntimeHistory = History & {
    block: (s: string) => () => void
    replace: (s: string) => void
    listen: (
      listenCb: (location: HistoryLocation, action: string) => void
    ) => () => void
    location: HistoryLocation
  }

  interface RenderContext {
    account: RenderRuntime['account']
    addMessages: (newMessages: RenderContext['messages']) => Promise<void>
    components: RenderRuntime['components']
    culture: RenderRuntime['culture']
    device: ConfigurationDevice
    emitter: RenderRuntime['emitter']
    extensions: RenderRuntime['extensions']
    fetchComponent: (component: string) => Promise<void>
    getSettings: (app: string) => unknown
    history: RuntimeHistory | null
    messages: RenderRuntime['messages']
    navigate: (options: NavigateOptions) => boolean
    onPageChanged: (location: Location) => void
    page: RenderRuntime['page']
    pages: RenderRuntime['pages']
    prefetchPage: (name: string) => Promise<void>
    preview: RenderRuntime['preview']
    production: RenderRuntime['production']
    route: RenderRuntime['route']
    renderMajor: RenderRuntime['renderMajor']
    setDevice: (device: ConfigurationDevice) => void
    updateComponentAssets: (availableComponents: Components) => void
    updateExtension: (name: string, extension: Extension) => Promise<void>
    updateRuntime: (options?: PageContextOptions) => Promise<void>
    workspace: RenderRuntime['workspace']
  }

  interface RenderContextProps {
    runtime: RenderContext
  }

  interface BlockData {
    componentImplementation?: RenderComponent | null
    componentSchema?: ComponentSchema
    configurations?: ExtensionConfiguration[]
    contentSchema?: JSONSchema6
    id?: string
    isSitewide?: boolean
    serverTreePath?: string
    template?: string
    title?: string
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
    addCondition: (conditionId: string) => void
    removeCondition?: (conditionId: string) => void
  }

  interface EditorContextType extends EditorConditionSection {
    allMatches: boolean
    availableCultures: LabelledLocale[]
    blockData: EditorProviderState['blockData']
    editMode: boolean
    editTreePath: string | null
    getIsLoading: () => boolean
    onChangeIframeUrl: (url: string) => void
    iframeWindow?: Window
    messages: RenderRuntime['messages']
    mode: EditorMode
    viewport: Viewport
    setBlockData: (blockData: EditorProviderState['blockData']) => void
    setDevice: (device: ConfigurationDevice) => void
    setIsLoading: (isLoading: boolean) => void
    setMode: (mode: EditorMode) => void
    setViewport: (viewport: Viewport) => void
    editExtensionPoint: (treePath: string | null) => void
    toggleEditMode: () => void
  }

  interface RenderRuntime {
    account: string
    accountId: string
    appsEtag: string
    customRouting?: boolean
    emitter: EventEmitter
    workspace: string
    disableSSR: boolean
    hints: unknown
    page: string
    version: string
    culture: Culture
    pages: Routes
    route: { pageContext: PageContext; path: string; params: {} }
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
      [app: string]: unknown
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

  type ConditionSubject = 'date' | 'utm'

  interface ExtensionConfiguration {
    condition: {
      allMatches: boolean
      id: string
      pageContext: RenderRuntime['route']['pageContext']
      statements: {
        objectJSON: string
        subject: ConditionSubject
        verb: string
      }[]
    }
    contentId: string | null
    contentJSON: string
    label: string | null
    origin: string | null
  }

  type RedirectTypes = 'permanent' | 'temporary'

  interface Redirect {
    cacheId: string
    disabled: boolean
    endDate: string
    from: string
    id: string
    to: string
    type: RedirectTypes
  }

  interface HighlightableIFrame extends HTMLIFrameElement {
    contentWindow: ContentWindow | null
  }

  interface ComponentSchemaProperties {
    [key: string]: ComponentSchema
  }

  interface ComponentSchema extends JSONSchema6 {
    type?: string
    title?: string
    description?: string
    enumNames?: string[]
    widget?: Record<string, string>
    minItems?: number
    properties?: ComponentSchemaProperties
    isLayout?: boolean
    items?: ComponentSchema | ComponentSchema[]
  }

  interface Window {
    __provideRuntime?: (
      runtime: RenderContext,
      messages: Record<string, string>,
      shouldUpdateRuntime: boolean
    ) => Promise<void>
    __setHighlightTreePath: (value: Partial<HighlightOverlayState>) => void
  }

  interface AdminContext {
    startLoading: () => void
    stopLoading: () => void
  }

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  type BlockRole = 'AFTER' | 'AROUND' | 'BEFORE' | 'BLOCK' | 'TEMPLATE'

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
