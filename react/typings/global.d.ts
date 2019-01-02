import { FontFamilyProperty, FontSizeProperty, FontWeightProperty, LetterSpacingProperty, TextTransformProperty } from 'csstype'
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
    allMatches: boolean
    declarer: string | null
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
    template: string
    title: string
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

  type ConditionType = 'scope' | 'device' | 'custom'

  interface Condition {
    conditionId: string
  }

  type Viewport = 'desktop' | 'mobile' | 'tablet'

  type ConfigurationDevice = 'any' | 'desktop' | 'mobile'

  type ServerConfigurationScope = 'url' | 'route'

  type ConfigurationScope = ServerConfigurationScope | 'site'

  type EditorMode = 'content' | 'layout' | 'style'

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
    mode: EditorMode
    scope: ConfigurationScope
    viewport: Viewport
    setDevice: (device: ConfigurationDevice) => void
    setMode: (mode: EditorMode) => void
    setScope: (scope: ConfigurationScope) => void
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

  interface StyleColors {
    emphasis: string
    actionPrimary: string
    actionSecondary: string
    base: string
  }

  interface StyleTypography {
    fontFamily: FontFamilyProperty
    fontWeight: FontWeightProperty
    fontSize: FontSizeProperty
    textTransform: TextTransformProperty
    letterSpacing: LetterSpacingProperty
  }

  interface StyleBasic {
    app: string
    name: string
  }

  interface Style extends StyleBasic {
    path: string
    colors: StyleColors
    typography: StyleTypography
    selected: boolean
  }

  interface PageContextOptions {
    scope?: ConfigurationScope
    device?: ConfigurationDevice
    conditions?: string[]
    template?: string
  }

  interface ServerExtensionConfiguration {
    allMatches: boolean
    conditions: string[]
    configurationId: string
    device: string
    label?: string
    propsJSON: string
    routeId: string
    scope: ServerConfigurationScope
    url: string
  }

  interface AdaptedExtensionConfiguration extends ServerExtensionConfiguration {
    scope: ConfigurationScope
  }

  type ExtensionConfiguration =
    | ServerExtensionConfiguration
    | AdaptedExtensionConfiguration

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
      shouldUpdateRuntime?: boolean,
    ) => void
  }

  interface AdminContext {
    startLoading: () => void
    stopLoading: () => void
  }
}
