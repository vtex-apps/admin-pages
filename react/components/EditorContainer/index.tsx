import debounce from 'lodash/debounce'
import { path } from 'ramda'
import React, { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, ToastConsumer } from 'vtex.styleguide'

import { State as HighlightOverlayState } from '../HighlightOverlay/typings'

import Sidebar from './Sidebar'
import { FormMetaProvider } from './Sidebar/FormMetaContext'
import { ModalProvider } from './Sidebar/ModalContext'

import IframeNavigationController from './IframeNavigationController'
import Styles from './Styles'
import Topbar from './Topbar'

import styles from './EditorContainer.css'

import '../../editbar.global.css'

export const APP_CONTENT_ELEMENT_ID = 'app-content-editor'

const getContainerProps = (layout: Viewport) => {
  switch (layout) {
    case 'mobile':
      return {
        className: `${styles['mobile-preview']} center`,
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    case 'tablet':
      return {
        className: `${styles['tablet-preview']} center`,
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
  editor: EditorContextType
  iframeRuntime: RenderContext | null
  isSiteEditor: boolean
}

const EditorContainer: React.FC<Props> = ({
  children,
  editor,
  iframeRuntime,
  isSiteEditor,
}) => {
  const { editMode, editExtensionPoint, viewport } = editor

  const highlightExtensionPoint = useCallback(
    debounce((highlightTreePath: string | null) => {
      const iframe = document.getElementById('store-iframe') || {}
      const setHighlightTreePath = path<
        (value: Partial<HighlightOverlayState>) => void
      >(['contentWindow', '__setHighlightTreePath'], iframe)
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

  const updateHighlightTitleByTreePath = useCallback(
    (
      sidebarBlocksMap?: Record<string, { title?: string; isEditable: boolean }>
    ) => {
      const iframe = document.getElementById('store-iframe') || {}
      const setHighlightTreePath = path<
        (value: Partial<HighlightOverlayState>) => void
      >(['contentWindow', '__setHighlightTreePath'], iframe)
      if (setHighlightTreePath) {
        setHighlightTreePath({
          sidebarBlocksMap: sidebarBlocksMap || {},
        })
      }
    },
    []
  )

  useEffect(() => {
    highlightExtensionPoint(null)
  }, [editMode, highlightExtensionPoint])

  const containerProps = useMemo(() => getContainerProps(viewport), [viewport])
  const isDevelopment = iframeRuntime && iframeRuntime.production === false
  const isMasterWorkspace =
    iframeRuntime && iframeRuntime.workspace === 'master'
  const hasAlert = isMasterWorkspace || isDevelopment

  return (
    <FormMetaProvider>
      <ModalProvider>
        <IframeNavigationController iframeRuntime={iframeRuntime} />
        <div className="w-100 h-100 min-vh-100 flex flex-row-reverse bg-base bb bw1 b--muted-5">
          {isSiteEditor && iframeRuntime && (
            <ToastConsumer>
              {({ showToast }) => (
                <Sidebar
                  highlightHandler={highlightExtensionPoint}
                  iframeRuntime={iframeRuntime}
                  showToast={showToast}
                  updateHighlightTitleByTreePath={
                    updateHighlightTitleByTreePath
                  }
                />
              )}
            </ToastConsumer>
          )}

          <div className="w-100 dn flex-ns flex-column">
            {isSiteEditor && iframeRuntime && (
              <Topbar iframeRuntime={iframeRuntime} />
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
                isSiteEditor && iframeRuntime
                  ? styles[`calc--height-relative${hasAlert ? '--dev' : ''}`]
                  : 'top-0 w-100 h-100'
              }`}
            >
              {!isSiteEditor && iframeRuntime && <Styles />}

              <div id={APP_CONTENT_ELEMENT_ID} className="relative w-100 h-100">
                <main
                  {...containerProps}
                  role="main"
                  style={{
                    transition: `width 250ms ease-in-out 0ms, height 250ms ease-in-out 0ms`,
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
