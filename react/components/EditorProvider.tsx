import ApolloClient from 'apollo-client'
import { difference, equals, pathOr, uniq } from 'ramda'
import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import { ToastProvider } from 'vtex.styleguide'

import { editorMessagesFromRuntime } from './DomainMessages'
import EditorContainer, { APP_CONTENT_ELEMENT_ID } from './EditorContainer'
import { EditorContext } from './EditorContext'
import MessagesContext, { IMessagesContext } from './MessagesContext'

type Props = RenderContextProps &
  IMessagesContext & { client: ApolloClient<any> }

interface State {
  activeConditions: string[]
  allMatches: boolean
  editMode: boolean
  editTreePath: string | null
  iframeRuntime: RenderContext | null
  iframeWindow: Window
  isLoading: boolean
  messages: RenderRuntime['messages']
  mode: EditorMode
  showAdminControls: boolean
  template?: string
  viewport: Viewport
}

// tslint:disable-next-line:no-empty
const noop = () => {}

const viewPorts: { [name: string]: Viewport[] } = {
  default: ['mobile', 'tablet', 'desktop'],
  desktop: [],
  mobile: ['mobile', 'tablet'],
}

class EditorProvider extends Component<Props, State> {
  private unlisten?: (() => void) | void

  constructor(props: Props) {
    super(props)

    this.state = {
      activeConditions: [],
      allMatches: true,
      editMode: false,
      editTreePath: null,
      iframeRuntime: null,
      iframeWindow: window,
      isLoading: false,
      messages: {},
      mode: 'content',
      showAdminControls: true,
      template: undefined,
      viewport: 'desktop',
    }

    if (canUseDOM) {
      window.__provideRuntime = async (
        runtime,
        messages,
        shouldUpdateRuntime
      ) => {
        const { client } = this.props
        let formattedEditorMessages = {}

        try {
          formattedEditorMessages = await editorMessagesFromRuntime({
            client,
            domain: 'admin',
            runtime,
          })
        } catch (e) {
          console.log(e)
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

        const newState = {
          ...this.state,
          iframeRuntime: runtime,
          ...(this.state.iframeRuntime
            ? {}
            : {
                iframeWindow: (document.getElementById(
                  'store-iframe'
                ) as HTMLIFrameElement).contentWindow as Window,
              }),
          messages: newMessages,
        }

        await new Promise(resolve => {
          this.setState(newState, resolve)
        })

        if (
          this.state.iframeRuntime &&
          this.state.iframeRuntime.history &&
          !this.unlisten
        ) {
          this.unlisten = this.state.iframeRuntime.history.listen(
            (location, action) => {
              const pathFromCurrentPage = this.state.iframeRuntime!.route.path
              const isRootPath =
                pathFromCurrentPage === '/' || location.pathname === '/'
              const hasParamsChanged = !equals(
                location.state.navigationRoute.params,
                this.state.iframeRuntime!.route.params
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

    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')

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
          setTimeout(() => window.dispatchEvent(e), 0)
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
      window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
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

  public render() {
    const {
      children,
      runtime: { device },
    } = this.props

    const {
      activeConditions,
      allMatches,
      editMode,
      editTreePath,
      iframeRuntime,
      iframeWindow,
      isLoading,
      messages,
      mode,
      showAdminControls,
      viewport,
    } = this.state

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      iframeWindow,
      isLoading,
      messages,
      mode,
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
            editor={editor}
            runtime={iframeRuntime}
            toggleShowAdminControls={this.handleToggleShowAdminControls}
            viewports={this.getAvailableViewports(device)}
            visible={showAdminControls}
          >
            {children}
          </EditorContainer>
        </EditorContext.Provider>
      </ToastProvider>
    )
  }

  private handleSetIsLoading = (isLoading: boolean) => {
    this.setState({ isLoading })
  }
}

const EditorWithMessageContext = (props: Omit<Props, 'setMessages'>) => (
  <MessagesContext.Consumer>
    {({ setMessages }) => (
      <EditorProvider {...props} setMessages={setMessages} />
    )}
  </MessagesContext.Consumer>
)

const EditorWithApolloAndRuntime = withRuntimeContext(
  withApollo<
    Omit<React.ComponentProps<typeof EditorWithMessageContext>, 'client'>
  >(EditorWithMessageContext)
)

export default EditorWithApolloAndRuntime
