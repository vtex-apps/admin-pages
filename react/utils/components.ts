import { global, Window } from 'render'

export function getImplementation(component: string) {
  return global.__RENDER_7_COMPONENTS__[component]
}

export function getIframeImplementation(component: string | null) {
  if (component === null) {
    return null
  }
  const iframeRenderComponents = getIframeRenderComponents()

  return (
    iframeRenderComponents && iframeRenderComponents[component]
  )
}

export function getIframeRenderComponents() {
  const iframe = document.getElementById('store-iframe') as HTMLIFrameElement
  if (!iframe) {
    return null
  }
  const window = iframe.contentWindow as Window | null
  if (!window) {
    return null
  }
  return window.__RENDER_7_COMPONENTS__
}
