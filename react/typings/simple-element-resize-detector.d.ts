declare module 'simple-element-resize-detector' {
  export default function(
    el: Element,
    handler: (el: Element) => void
  ): HTMLIFrameElement
}
