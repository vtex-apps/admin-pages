import {
  ContentBlock,
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
} from 'draft-js'
import * as React from 'react'

import styles from './style.css'

import ImageInput from './RichTextEditor/ImageInput'
import Media from './RichTextEditor/Media'
import StyleButton from './RichTextEditor/StyleButton'

// custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
]

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
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
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
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

function getBlockStyle(block: ContentBlock): string {
  switch (block.getType()) {
    case 'blockquote': 
      return styles.RichEditor_blockquote
    default: 
      return ''
  }
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

const RichTextEditor = () => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

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
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <ImageInput onAdd={handleAddImage} />
      </div>
      <div className={className}>
        <Editor
          editorState={editorState}
          onChange={(state) => handleChange(state)}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          blockRendererFn={mediaBlockRenderer}
        />
      </div>
    </div>
  )
}

export default RichTextEditor