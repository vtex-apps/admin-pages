import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js'
import { draftjsToMd, mdToDraftjs } from 'draftjs-md-converter'

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
  return draftjsToMd(rawContentState)
}

export function convertToEditorState(markdownText: string) {
  const rawMarkdown = mdToDraftjs(markdownText)
  return convertFromRaw(rawMarkdown)
}
