import PropTypes from 'prop-types'
import { difference, pathOr, uniq } from 'ramda'
import React, { Component } from 'react'
import { compose, DataProps, graphql } from 'react-apollo'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import { ToastProvider } from 'vtex.styleguide'

import AvailableConditions from '../queries/AvailableConditions.graphql'

import EditorContainer, { APP_CONTENT_ELEMENT_ID } from './EditorContainer'
import { EditorContext } from './EditorContext'
import MessagesContext, { IMessagesContext } from './MessagesContext'

type Props = RenderContextProps &
  DataProps<{ availableConditions: [Condition] }> &
  IMessagesContext

interface State {
  activeConditions: string[]
  allMatches: boolean
  editMode: boolean
  editTreePath: string | null
  iframeRuntime: RenderContext | null
  iframeWindow: Window
  mode: EditorMode
  scope: ConfigurationScope
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
  public static contextTypes = {
    components: PropTypes.object,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      activeConditions: [],
      allMatches: true,
      editMode: false,
      editTreePath: null,
      iframeRuntime: null,
      iframeWindow: window,
      mode: 'content',
      scope: 'url',
      showAdminControls: true,
      template: undefined,
      viewport: 'desktop',
    }

    if (canUseDOM) {
      window.__provideRuntime = async (
        runtime: RenderContext,
        messages?: object,
        shouldUpdateRuntime?: boolean
      ) => {
        this.props.setMessages(messages)

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
        }

        this.setState(newState)
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
    const editMode = false

    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      (e: Element) =>
        showAdminControls
          ? e.classList.add('editor-provider')
          : e.classList.remove('editor-provider')
    )

    this.setState({ showAdminControls, editMode })
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
          scope: this.state.scope,
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
        scope: this.state.scope,
        template: this.state.template,
      })
    })
  }

  public handleSetScope = (scope: ConfigurationScope) => {
    this.setState({ scope })
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
      scope: this.state.scope,
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
      mode,
      scope,
      showAdminControls,
      viewport,
    } = this.state

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      allMatches,
      conditions: this.props.data.availableConditions || [],
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      iframeWindow,
      mode,
      removeCondition: this.handleRemoveCondition,
      scope,
      setDevice: this.handleSetDevice,
      setMode: this.handleSetMode,
      setScope: this.handleSetScope,
      setViewport: this.handleSetViewport,
      toggleEditMode: this.handleToggleEditMode,
      viewport,
    }

    const childrenWithSidebar = (
      <EditorContainer
        editor={editor}
        runtime={iframeRuntime}
        toggleShowAdminControls={this.handleToggleShowAdminControls}
        viewports={this.getAvailableViewports(device)}
        visible={showAdminControls}
      >
        {children}
      </EditorContainer>
    )

    return (
      <ToastProvider positioning="parent">
        <EditorContext.Provider value={editor}>
          {childrenWithSidebar}
        </EditorContext.Provider>
      </ToastProvider>
    )
  }
}

const EditorWithMessageContext = (props: Props) => (
  <MessagesContext.Consumer>
    {({ setMessages }) => (
      <EditorProvider {...props} setMessages={setMessages} />
    )}
  </MessagesContext.Consumer>
)

export default compose(
  graphql(AvailableConditions),
  withRuntimeContext
)(EditorWithMessageContext)
