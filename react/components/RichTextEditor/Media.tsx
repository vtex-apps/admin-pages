import * as React from 'react'

import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftInlineStyle,
  DraftStyleMap,
  SelectionState,
} from 'draft-js'
import { List } from 'immutable'

interface MediaProps {
  block: ContentBlock
  blockProps: { [key: string]: any } | undefined
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
  tree: List<any>
}

const Media = (props: MediaProps) => {
  const { contentState, block } = props
  const blockEntity = block.getEntityAt(0)

  if (!blockEntity) {
    return null
  }

  const entity = contentState.getEntity(blockEntity)
  const { src } = entity.getData()
  const type = entity.getType()

  if (type === 'IMAGE') {
    return <img src={src} />
  }

  return null
}

export default Media
