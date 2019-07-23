import debounce from 'lodash.debounce'
import { path } from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Draggable from 'react-draggable'
import { FormattedMessage } from 'react-intl'
import { Alert } from 'vtex.styleguide'

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

const EditorContainer: React.FC<Props> = ({
  children,
  editor,
  runtime,
  toggleShowAdminControls,
  viewports,
  visible,
}) => {
  const {
    editMode,
    editExtensionPoint,
    viewport,
    iframeWindow,
    onChangeIframeUrl,
  } = editor
  const [storeEditMode, setStoreEditMode] = useState<StoreEditMode>()

  const highlightExtensionPoint = useCallback(
    debounce((highlightTreePath: string | null) => {
      const iframe = document.getElementById('store-iframe') || {}
      const setHighlightTreePath = path<(value: HighlightOverlayState) => void>(
        ['contentWindow', '__setHighlightTreePath'],
        iframe
      )
      if (setHighlightTreePath) {
        setHighlightTreePath({
          editExtensionPoint,
          editMode,
          highlightHandler: highlightExtensionPoint,
          highlightTreePath,
        })
      }
    }, 100),
    [editMode, editExtensionPoint]
  )

  useEffect(() => {
    highlightExtensionPoint(null)
  }, [editMode])

  const containerProps = useMemo(() => getContainerProps(viewport), [viewport])
  const isDevelopment = runtime && runtime.production === false
  const isMasterWorkspace = runtime && runtime.workspace === 'master'
  const hasAlert = isMasterWorkspace || isDevelopment

  return (
    <FormMetaProvider>
      <ModalProvider>
        <IframeNavigationController iframeRuntime={runtime} />
        <div className="w-100 h-100 min-vh-100 flex flex-row-reverse flex-wrap-l bg-base bb bw1 b--muted-5">
          {!storeEditMode && runtime && (
            <Sidebar
              highlightHandler={highlightExtensionPoint}
              runtime={runtime}
              visible={visible}
            />
          )}
          <div className="flex-grow-1 db-ns dn">
            {runtime && (
              <Topbar
                changeMode={setStoreEditMode}
                mode={storeEditMode}
                onChangeUrlPath={onChangeIframeUrl}
                urlPath={iframeWindow.location.pathname}
                visible={visible}
              />
            )}
            {isDevelopment && (
              <div className="pa5 bg-muted-5">
                <Alert type="warning">
                  <FormattedMessage
                    id="admin/pages.editor.container.dev-mode-warning.text"
                    defaultMessage="You are in development mode. Changes to the content will not go to production."
                  />
                </Alert>
              </div>
            )}
            {isMasterWorkspace && (
              <div className="pa5 bg-muted-5">
                <Alert type="warning">
                  <FormattedMessage
                    id="admin/pages.editor.container.master-workspace-warning.text"
                    defaultMessage="You are editing the live store. Changes will have immediate effect."
                  />
                </Alert>
              </div>
            )}
            <div
              className={`pa5 bg-muted-5 flex items-start z-0 center-m left-0-m overflow-x-auto-m ${
                visible && runtime
                  ? `calc--height-relative${hasAlert ? '--dev' : ''}`
                  : 'top-0 w-100 h-100'
              }`}
            >
              {runtime && storeEditMode && (
                <StoreEditor
                  editor={editor}
                  mode={storeEditMode}
                  visible={visible}
                />
              )}
              <div id={APP_CONTENT_ELEMENT_ID} className="relative w-100 h-100">
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
                  {...containerProps}
                  role="main"
                  style={{
                    transition: `width 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms`,
                  }}
                >
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>
      </ModalProvider>
    </FormMetaProvider>
  )
}

export default EditorContainer
