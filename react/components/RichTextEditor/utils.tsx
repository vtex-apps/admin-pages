import * as React from 'react'
import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'

import Media from './Media'

export function mediaBlockRenderer(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    }
  }

  return null
}

export function styleBlockRenderer(block: ContentBlock) {
  const blockType = block.getType()
  if (blockType === 'left') return 'align-left'
  if (blockType === 'center') return 'align-center'
  if (blockType === 'right') return 'align-right'
  return ''
}

export function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  return contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    )
  }, callback)
}

export function convertToMarkdown(editorState: EditorState) {
  const rawContentState = convertToRaw(editorState.getCurrentContent())
  return draftToMarkdown(rawContentState)
}

export function convertToEditorState(markdownText: string) {
  const rawMarkdown = markdownToDraft(markdownText)
  return convertFromRaw(rawMarkdown)
}

export function useClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) {
  function handleClickOutside(event: MouseEvent) {
    if (ref && ref.current && !ref.current.contains(event.target as Node)) {
      callback()
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })
}
