import { path } from 'ramda'
import React, { Component } from 'react'
import Draggable from 'react-draggable'

import { State as HighlightOverlayState } from '../../HighlightOverlay'

import DeviceSwitcher from './DeviceSwitcher'
import Sidebar from './Sidebar'
import { FormMetaProvider } from './Sidebar/FormMetaContext'
import { ModalProvider } from './Sidebar/ModalContext'

import IframeNavigationController from './IframeNavigationController'
import StoreEditor from './StoreEditor'
import Topbar from './Topbar'

import '../../editbar.global.css'

export const APP_CONTENT_ELEMENT_ID = 'app-content-editor'

const getContainerProps = (layout: Viewport) => {
  switch (layout) {
    case 'mobile':
      return {
        className: 'mobile-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    case 'tablet':
      return {
        className: 'tablet-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    default:
      return {
        className: 'w-100 h-100 center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
  }
}

interface Props {
  editor: EditorContext
  runtime: RenderContext | null
  toggleShowAdminControls: () => void
  viewports: Viewport[]
  visible: boolean
}

interface State {
  highlightTreePath: string | null
  storeEditMode?: StoreEditMode
}

export default class EditorContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      highlightTreePath: null,
    }
  }

  public componentDidMount() {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public getSnapshotBeforeUpdate(prevProps: Props) {
    const {
      editor: { editMode },
    } = this.props

    if (prevProps.editor.editMode !== editMode) {
      this.highlightExtensionPoint(null)
    }

    return null
  }

  public highlightExtensionPoint = (highlightTreePath: string | null) => {
    const {
      editor: { editMode, editExtensionPoint },
    } = this.props

    this.setState({ highlightTreePath }, () => {
      const iframe = document.getElementById('store-iframe') || {}
      const setHighlightTreePath = path<(value: HighlightOverlayState) => void>(
        ['contentWindow', '__setHighlightTreePath'],
        iframe
      )
      if (setHighlightTreePath) {
        setHighlightTreePath({
          editExtensionPoint,
          editMode,
          highlighHandler: this.highlightExtensionPoint,
          highlightTreePath,
        })
      }
    })
  }

  public render() {
    const {
      editor,
      editor: { viewport, iframeWindow },
      runtime,
      toggleShowAdminControls,
      viewports,
      visible,
    } = this.props

    const { storeEditMode } = this.state

    return (
      <FormMetaProvider>
        <ModalProvider>
          <IframeNavigationController iframeRuntime={runtime} />
          <div className="w-100 h-100 flex flex-column flex-row-reverse-l flex-wrap-l bg-base bb bw1 b--muted-5">
            {visible && !storeEditMode && runtime && (
              <Sidebar
                editor={editor}
                highlightHandler={this.highlightExtensionPoint}
                runtime={runtime}
              />
            )}
            <div className="calc--height-ns flex-grow-1 db-ns dn">
              {visible && (
                <Topbar
                  changeMode={(mode?: StoreEditMode) => {
                    this.setState({
                      storeEditMode: mode,
                    })
                  }}
                  mode={storeEditMode}
                  urlPath={iframeWindow.location.pathname}
                />
              )}
              <div
                className={`pa5 bg-muted-5 flex items-center z-0 center-m left-0-m overflow-x-auto-m ${
                  visible ? 'calc--height-relative' : 'top-0 w-100 h-100'
                }`}
              >
                {visible && storeEditMode && (
                  <StoreEditor editor={editor} mode={storeEditMode} />
                )}
                <div
                  id={APP_CONTENT_ELEMENT_ID}
                  className="relative w-100 h-100"
                >
                  <Draggable
                    bounds="parent"
                    onStart={() => {
                      const iframe = document.getElementById('store-iframe')
                      if (iframe !== null) {
                        iframe.classList.add('iframe-pointer-none')
                      }
                    }}
                    onStop={() => {
                      const iframe = document.getElementById('store-iframe')
                      if (iframe !== null) {
                        iframe.classList.remove('iframe-pointer-none')
                      }
                    }}
                  >
                    <div className="animated br2 bg-base bn shadow-1 flex items-center justify-center z-max absolute bottom-1 bottom-2-ns left-1 left-2-ns">
                      <DeviceSwitcher
                        inPreview={!visible}
                        setViewport={editor.setViewport}
                        toggleEditMode={toggleShowAdminControls}
                        viewport={editor.viewport}
                        viewports={viewports}
                      />
                    </div>
                  </Draggable>
                  <main
                    {...getContainerProps(viewport)}
                    role="main"
                    style={{
                      transition: `width 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms`,
                    }}
                  >
                    {this.props.children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </ModalProvider>
      </FormMetaProvider>
    )
  }
}
