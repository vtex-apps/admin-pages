import {
  ContentBlock,
  ContentState,
  convertToRaw,
  EditorState,
} from 'draft-js'
import draftToMarkdown from 'draftjs-to-markdown'

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

export function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  return contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}

export function convertToMarkdown(editorState: EditorState) {
  const rawContentState = convertToRaw(editorState.getCurrentContent())
  return draftToMarkdown(rawContentState)
}