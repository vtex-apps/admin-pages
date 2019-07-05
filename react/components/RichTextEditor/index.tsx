import {
  AtomicBlockUtils,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js'
import * as React from 'react'

import {
  IconBold,
  IconItalic,
  IconOrderedList,
  IconUnderline,
  IconUnorderedList,
} from 'vtex.styleguide'

import styles from './style.css'

import ImageInput from './ImageInput'
import Link from './Link'
import LinkInput from './LinkInput'
import Media from './Media'
import StyleButton from './StyleButton'

const INLINE_STYLES = [
  { label: <IconBold />, style: 'BOLD' },
  { label: <IconItalic />, style: 'ITALIC' },
  { label: <IconUnderline />, style: 'UNDERLINE' },
]

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: <IconUnorderedList />, style: 'unordered-list-item' },
  { label: <IconOrderedList />, style: 'ordered-list-item' },
]

const BlockStyleControls = (props: any) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="mb3">
      {BLOCK_TYPES.map((type, i) =>
        <StyleButton
          key={i}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}

const InlineStyleControls = (props: any) => {
  const { editorState } = props
  const currentStyle = editorState.getCurrentInlineStyle()
  
  return (
    <div className="">
      {INLINE_STYLES.map((type, i) =>
        <StyleButton
          key={i}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}

function mediaBlockRenderer(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    }
  }

  return null
}

function findLinkEntities(
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

const RichTextEditor = () => {
  const decorator = new CompositeDecorator([{ strategy: findLinkEntities, component: Link }])
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty(decorator))

  let className = `${styles.RichEditor_editor}`
  const contentState = editorState.getCurrentContent()
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ` ${styles.RichEditor_hidePlaceholder}`
    }
  }

  const handleAddImage = (imageLink: string) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: imageLink }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
    return setEditorState(AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' '
    ))
  }

  const handleAddLink = (linkUrl: string) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'IMMUTABLE',
      { url: linkUrl }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
    return setEditorState(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    ))
  }

  const handleChange = (state: EditorState) => {
    return setEditorState(state)
  }

  const toggleBlockType = (blockType: string) => {
    handleChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }

  const toggleInlineStyle = (inlineStyle: string) => {
    handleChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    )
  }

  return (
    <div className="bw1 br2 b--solid b--muted-4">
      <div className="pa4">
        <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
        <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
        <ImageInput onAdd={handleAddImage} />
        <LinkInput onAdd={handleAddLink} />
      </div>
      <div className={className}>
        <Editor
          editorState={editorState}
          onChange={(state) => handleChange(state)}
          blockRendererFn={mediaBlockRenderer}
        />
      </div>
    </div>
  )
}

export default RichTextEditor