import ApolloClient from 'apollo-client'
import { difference, equals, path, pathOr, uniq } from 'ramda'
import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import { ToastProvider } from 'vtex.styleguide'

import { State as HighlightOverlayState } from '../HighlightOverlay'

import { injectIntl } from 'react-intl'
import {
  editorMessagesFromRuntime,
  getAvailableCultures,
  LabelledLocale,
} from './DomainMessages'
import EditorContainer, { APP_CONTENT_ELEMENT_ID } from './EditorContainer'
import { EditorContext } from './EditorContext'
import MessagesContext, { MessagesContextProps } from './MessagesContext'

type Props = RenderContextProps &
  ReactIntl.InjectedIntlProps &
  MessagesContextProps & { client: ApolloClient<unknown> } & {
    isSiteEditor: boolean
  }

export interface State {
  activeConditions: string[]
  allMatches: boolean
  availableCultures: LabelledLocale[]
  blockData: BlockData
  editMode: boolean
  editTreePath: string | null
  iframeRuntime: RenderContext | null
  iframeWindow?: Window
  isLoading: boolean
  isSidebarVisible: boolean
  messages: RenderRuntime['messages']
  mode: EditorMode
  viewport: Viewport
}

const noop = () => {}

const getUrlProperties = (href: string) => {
  const match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  )

  return (
    match && {
      hash: match[7],
      host: match[2],
      hostname: match[3],
      href,
      pathname: match[5],
      port: match[4],
      protocol: match[1],
      search: match[6],
    }
  )
}

class EditorProvider extends Component<Props, State> {
  private unlisten?: (() => void) | void

  public constructor(props: Props) {
    super(props)

    this.state = {
      activeConditions: [],
      allMatches: true,
      availableCultures: [],
      blockData: {},
      editMode: false,
      editTreePath: null,
      iframeRuntime: null,
      iframeWindow: window.self,
      isLoading: false,
      isSidebarVisible: true,
      messages: {},
      mode: 'content',
      viewport: 'desktop',
    }

    if (canUseDOM) {
      window.top.__provideRuntime = window.self.__provideRuntime = async (
        runtime,
        messages,
        shouldUpdateRuntime
      ) => {
        const { client, intl } = this.props
        const stateIframeRuntime = this.state.iframeRuntime

        let formattedEditorMessages = {}

        try {
          formattedEditorMessages = await editorMessagesFromRuntime({
            client,
            domain: 'admin',
            runtime,
          })
        } catch (e) {
          console.error(e)
        }

        const newMessages = {
          ...this.state.messages,
          ...messages,
          ...formattedEditorMessages,
        }

        this.props.setMessages(newMessages)

        if (shouldUpdateRuntime) {
          await this.props.runtime.updateRuntime()
        }

        if (!this.state.iframeRuntime) {
          runtime.updateComponentAssets(this.props.runtime.components)
          this.props.runtime.updateComponentAssets({})
        }

        const availableCultures = await getAvailableCultures({ client, intl })

        const newState = {
          availableCultures,
          iframeRuntime: runtime,
          ...(stateIframeRuntime
            ? {}
            : {
                iframeWindow: (window.self.document.getElementById(
                  'store-iframe'
                ) as HTMLIFrameElement).contentWindow as Window,
              }),
          messages: newMessages,
        }

        await new Promise(resolve => {
          this.setState(newState, resolve)
        })

        if (
          stateIframeRuntime &&
          stateIframeRuntime.history &&
          !this.unlisten
        ) {
          this.unlisten = stateIframeRuntime.history.listen(
            (location, action) => {
              const pathFromCurrentPage = stateIframeRuntime.route.path
              const isRootPath =
                pathFromCurrentPage === '/' || location.pathname === '/'
              const hasParamsChanged =
                !location.state ||
                !equals(
                  location.state.navigationRoute.params,
                  stateIframeRuntime.route.params
                )

              const isDifferentPath = isRootPath
                ? pathFromCurrentPage !== location.pathname
                : !pathFromCurrentPage.startsWith(location.pathname) ||
                  hasParamsChanged // to consider canonicals

              const hasNavigated =
                ['PUSH', 'REPLACE', 'POP'].includes(action) && isDifferentPath

              if (hasNavigated) {
                this.handleSetIsLoading(true)
                this.editExtensionPoint(null)
              }
            }
          )
        }
      }
    }
  }

  public componentDidMount() {
    const {
      runtime: { page, production, emitter },
    } = this.props

    const root = page.split('/')[0]

    if (root !== 'admin') {
      Array.prototype.forEach.call(
        document.getElementsByClassName('render-container'),
        (e: Element) => e.classList.add('editor-provider')
      )
    }

    if (window.top) {
      window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
    }

    const appContentElement = document.getElementById(APP_CONTENT_ELEMENT_ID)
    emitter.addListener('localesChanged', this.emitLocaleEventToIframe)

    if (!production) {
      emitter.addListener('localesUpdated', this.emitLocaleEventToIframe)
    }

    // Forward scroll events to window so code doesn't have to hook into #app-content
    if (appContentElement) {
      appContentElement.addEventListener(
        'scroll',
        e => {
          setTimeout(() => window.self.dispatchEvent(e), 0)
        },
        { passive: true }
      )
    }
  }

  public componentWillUnmount() {
    const {
      runtime: { production, emitter },
    } = this.props

    emitter.removeListener('localesChanged', this.emitLocaleEventToIframe)

    if (!production) {
      emitter.removeListener('localesUpdated', this.emitLocaleEventToIframe)
    }

    if (this.unlisten) {
      this.unlisten()
    }
  }

  public emitLocaleEventToIframe = (event: string) => {
    const emitToIframe: RenderRuntime['emitter'] = pathOr({ emit: noop }, [
      'state',
      'iframeRuntime',
      'emitter',
    ])(this)
    emitToIframe.emit('localesChanged', event)
  }

  public editExtensionPoint = (treePath: string | null) => {
    const iframe = document.getElementById('store-iframe') || {}
    const setHighlightTreePath = path<
      (value: Partial<HighlightOverlayState>) => void
    >(['contentWindow', '__setHighlightTreePath'], iframe)
    if (setHighlightTreePath) {
      setHighlightTreePath({
        openBlockTreePath: treePath,
      })
    }

    this.setState({ editTreePath: treePath, editMode: false })
  }

  public handleToggleEditMode = () => {
    const editMode = !this.state.editMode

    this.setState({ editMode }, () => {
      if (window.top) {
        window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      }
    })
  }

  public toggleSidebarVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      isSidebarVisible: !prevState.isSidebarVisible,
    }))
  }

  public handleAddCondition = (conditionId: string) => {
    this.setState(
      {
        activeConditions: uniq(this.state.activeConditions.concat(conditionId)),
      },
      () => {
        this.props.runtime.updateRuntime({
          conditions: this.state.activeConditions,
          device: this.props.runtime.device,
        })
      }
    )
  }

  public handleRemoveCondition = (conditionId: string) => {
    const activeConditions = difference(this.state.activeConditions, [
      conditionId,
    ])

    this.setState({ activeConditions }, () => {
      this.props.runtime.updateRuntime({
        conditions: this.state.activeConditions,
        device: this.props.runtime.device,
      })
    })
  }

  public handleSetDevice = (device: ConfigurationDevice) => {
    this.props.runtime.setDevice(device)

    this.handleSetViewport(device === 'any' ? 'desktop' : device)

    this.props.runtime.updateRuntime({
      conditions: this.state.activeConditions,
      device,
    })
  }

  public handleSetViewport = (viewport: Viewport) => {
    this.setState({ viewport })
  }

  public handleSetMode = (mode: EditorMode) => {
    this.setState({ mode })
  }

  public handleChangeIframeUrl = (url: string) => {
    window.top.postMessage({ action: { type: 'START_LOADING' } }, '*')

    const convertedUrl = getUrlProperties(url)
    const storePath = convertedUrl ? convertedUrl.pathname : url
    const pathname = /^\//.test(storePath) ? storePath : `/${storePath}`

    window.top.location.assign(`/admin/cms/site-editor${pathname}`)
  }

  public handleSetBlockData = (newBlockData: State['blockData']) => {
    this.setState(prevState => ({
      ...prevState,
      blockData: { ...prevState.blockData, ...newBlockData },
    }))
  }

  public render() {
    const { children, isSiteEditor } = this.props

    const {
      activeConditions,
      allMatches,
      availableCultures,
      blockData,
      editMode,
      editTreePath,
      iframeRuntime,
      iframeWindow,
      isSidebarVisible,
      messages,
      mode,
      viewport,
    } = this.state

    const editor: EditorContextType = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      availableCultures,
      blockData,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      getIsLoading: this.getIsLoading,
      iframeWindow,
      isSidebarVisible,
      messages,
      mode,
      onChangeIframeUrl: this.handleChangeIframeUrl,
      removeCondition: this.handleRemoveCondition,
      setBlockData: this.handleSetBlockData,
      setDevice: this.handleSetDevice,
      setIsLoading: this.handleSetIsLoading,
      setMode: this.handleSetMode,
      setViewport: this.handleSetViewport,
      toggleEditMode: this.handleToggleEditMode,
      toggleSidebarVisibility: this.toggleSidebarVisibility,
      viewport,
    }

    return (
      <ToastProvider positioning="parent">
        <EditorContext.Provider value={editor}>
          <EditorContainer
            editor={editor}
            iframeRuntime={iframeRuntime}
            isSiteEditor={isSiteEditor}
          >
            {children}
          </EditorContainer>
        </EditorContext.Provider>
      </ToastProvider>
    )
  }

  private getIsLoading = () => this.state.isLoading

  private handleSetIsLoading = (isLoading: boolean) => {
    this.setState({ isLoading })
  }
}

const EditorWithMessageContext = (props: Omit<Props, 'setMessages'>) => (
  <MessagesContext.Consumer>
    {({ setMessages }) => {
      return <EditorProvider {...props} setMessages={setMessages} />
    }}
  </MessagesContext.Consumer>
)

const EditorWithApolloAndRuntime = withRuntimeContext(
  withApollo<
    Omit<React.ComponentProps<typeof EditorWithMessageContext>, 'client'>
  >(EditorWithMessageContext)
)

export default injectIntl(EditorWithApolloAndRuntime)
