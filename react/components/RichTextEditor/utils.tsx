import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  Entity,
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
  return draftToMarkdown(rawContentState, {
    entityItems: {
      image: {
        close: (entity: any) => `![](${entity.data.src})`,
        open: (entity: any) => '',
      },
    },
  })
}

export function convertToEditorState(markdownText: string) {
  const rawMarkdown = markdownToDraft(markdownText, {
    blockTypes: {
      image_open: (item: any) => ({
        data: { src: item.src },
        mutability: 'IMMUTABLE',
        type: 'atomic',
      }),
    },
    // remarkablePlugins: [buildImageBLock],
  })
  return convertFromRaw(rawMarkdown)
}

const ImageRegexp = /^!\[([^\]]*)]\s*\(([^)"]+)( "([^)"]+)")?\)/
const buildImageBLock = (remarkable: any) => {
  return remarkable.block.ruler.before('paragraph', 'image', (state: any, startLine: number, endLine: number, silent: boolean) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    if (pos >= max) {
      return false
    }

    if (!state.src) {
      return false
    }
    if (state.src[pos] !== '!') {
      return false
    }

    const match = ImageRegexp.exec(state.src.slice(pos))
    if (!match) {
      return false
    }

    if (!silent) {
      state.tokens.push({
        alt: match[1],
        level: state.level,
        lines: [ startLine, state.line ],
        src: match[2],
        type: 'image_open',
      })

      state.tokens.push({
        children: [],
        content: match[4] || '',
        level: state.level + 1,
        lines: [ startLine, state.line ],
        type: 'inline',
      })

      state.tokens.push({
        level: state.level,
        type: 'image_close',
      })
    }

    state.line = startLine + 1

    return true
  })
}