export function getImplementation(component) {
  return global.__RENDER_7_COMPONENTS__[component]
}

export function getIframeImplementation(component) {
  const iframe = document.getElementById('store-iframe')
  return iframe && iframe.contentWindow && iframe.contentWindow.__RENDER_7_COMPONENTS__
    && iframe.contentWindow.__RENDER_7_COMPONENTS__[component]
}
