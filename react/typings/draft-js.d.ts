import 'draft-js'
declare module 'draft-js' {
  export interface Media {
    block: ContentBlock
    blockProps: { [key: string]: unknown } | undefined
    blockStyleFn?: (block: ContentBlock) => string
    contentState: ContentState
    customStyleFn?: (
      style: DraftInlineStyle,
      block: ContentBlock
    ) => DraftStyleMap
    customStyleMap: DraftStyleMap
    decorator: CompositeDecorator
    direction: string
    forceSelection: boolean
    offsetKey: string
    selection: SelectionState
    tree: Immutable.List<unknown>
  }

  export interface Link {
    children: React.ElementType[]
    contentState: ContentState
    decoratedText: string
    dir: string | null
    entityKey: string
    offsetKey: string
  }
}
