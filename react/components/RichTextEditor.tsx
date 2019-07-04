import {
  ContentBlock,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js'
import * as React from 'react'

import styles from './style.css'

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
  {label: 'Monospace', style: 'CODE'},
]

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
]

const RichTextEditor = () => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

  let className = `${styles.RichEditor_editor}`
  const contentState = editorState.getCurrentContent()
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ` ${styles.RichEditor_hidePlaceholder}`
    }
  }
  const handleChange = (state: EditorState) => {
    console.log('----- state:', state)
    
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
    <div className={styles.RichEditor_root}>
      <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
      <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
      <div className={className}>
        <Editor
          editorState={editorState}
          onChange={(state) => handleChange(state)}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  )
}

export default RichTextEditor

const StyleButton = ({ active, onToggle, style, label }: { label: string, active: boolean, onToggle: Function, style: any }) => {
  const className = `${styles.RichEditor_styleButton} ${active ? styles.RichEditor_activeButton : ''}`

  const handleToggle = (e: any) => {
    e.preventDefault()
    onToggle(style)
  }
  return (
    <span className={className} onMouseDown={handleToggle}>
      {label}
    </span>
  )
}

const BlockStyleControls = (props: any) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className={styles.RichEditor_controls}>
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
    <div className={styles.RichEditor_controls}>
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
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
