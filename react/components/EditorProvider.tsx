import ApolloClient from 'apollo-client'
import { difference, equals, pathOr, uniq } from 'ramda'
import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import { ToastProvider } from 'vtex.styleguide'

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
  MessagesContextProps & { client: ApolloClient<unknown> }

interface State {
  activeConditions: string[]
  allMatches: boolean
  availableCultures: LabelledLocale[]
  editMode: boolean
  editTreePath: string | null
  iframeRuntime: RenderContext | null
  iframeWindow?: Window
  isLoading: boolean
  messages: RenderRuntime['messages']
  mode: EditorMode
  showAdminControls: boolean
  template?: string
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

const viewPorts: { [name: string]: Viewport[] } = {
  default: ['mobile', 'tablet', 'desktop'],
  desktop: [],
  mobile: ['mobile', 'tablet'],
}

class EditorProvider extends Component<Props, State> {
  private unlisten?: (() => void) | void

  public constructor(props: Props) {
    super(props)

    this.state = {
      activeConditions: [],
      allMatches: true,
      availableCultures: [],
      editMode: false,
      editTreePath: null,
      iframeRuntime: null,
      iframeWindow: window.self,
      isLoading: false,
      messages: {},
      mode: 'content',
      showAdminControls: true,
      template: undefined,
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

  public handleToggleShowAdminControls = () => {
    const showAdminControls = !this.state.showAdminControls

    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      (e: Element) =>
        showAdminControls
          ? e.classList.add('editor-provider')
          : e.classList.remove('editor-provider')
    )

    this.setState({ showAdminControls })
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
          template: this.state.template,
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
        template: this.state.template,
      })
    })
  }

  public getViewport = (device: ConfigurationDevice) => {
    switch (device) {
      case 'any':
        return 'desktop'
      default:
        return device
    }
  }

  public handleSetDevice = (device: ConfigurationDevice) => {
    this.props.runtime.setDevice(device)

    this.handleSetViewport(this.getViewport(device))

    this.props.runtime.updateRuntime({
      conditions: this.state.activeConditions,
      device,
      template: this.state.template,
    })
  }

  public getAvailableViewports = (device: ConfigurationDevice): Viewport[] => {
    switch (device) {
      case 'mobile':
        return viewPorts.mobile
      case 'desktop':
        return viewPorts.desktop
      default:
        return viewPorts.default
    }
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

  public render() {
    const {
      children,
      runtime: { device },
    } = this.props

    const {
      activeConditions,
      allMatches,
      availableCultures,
      editMode,
      editTreePath,
      iframeRuntime,
      iframeWindow,
      messages,
      mode,
      showAdminControls,
      viewport,
    } = this.state

    const editor: EditorContextType = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      availableCultures,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      getIsLoading: this.getIsLoading,
      iframeWindow,
      messages,
      mode,
      onChangeIframeUrl: this.handleChangeIframeUrl,
      removeCondition: this.handleRemoveCondition,
      setDevice: this.handleSetDevice,
      setIsLoading: this.handleSetIsLoading,
      setMode: this.handleSetMode,
      setViewport: this.handleSetViewport,
      toggleEditMode: this.handleToggleEditMode,
      viewport,
    }

    return (
      <ToastProvider positioning="parent">
        <EditorContext.Provider value={editor}>
          <EditorContainer
            availableCultures={this.state.availableCultures}
            editor={editor}
            runtime={iframeRuntime}
            onShowAdminControlsToggle={this.handleToggleShowAdminControls}
            viewports={this.getAvailableViewports(device)}
            visible={showAdminControls}
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
