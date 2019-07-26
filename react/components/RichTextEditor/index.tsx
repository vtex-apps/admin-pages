import {
  AtomicBlockUtils,
  CompositeDecorator,
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
import StyleButton from './StyleButton'

import {
  convertToEditorState,
  convertToMarkdown,
  findLinkEntities,
  mediaBlockRenderer,
} from './utils'

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

interface BlockStyleControlsProps {
  editorState: EditorState
  onToggle: (blockType: string) => void
}
const BlockStyleControls = (props: BlockStyleControlsProps) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <>
      {BLOCK_TYPES.map((type, i) => (
        <StyleButton
          key={i}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </>
  )
}

interface InlineStyleControlsProps {
  editorState: EditorState
  onToggle: (inlineStyle: string) => void
}
const InlineStyleControls = (props: InlineStyleControlsProps) => {
  const { editorState } = props
  const currentStyle = editorState.getCurrentInlineStyle()

  return (
    <>
      {INLINE_STYLES.map((type, i) => (
        <StyleButton
          key={i}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </>
  )
}

interface Props {
  onChange?: (value: string) => void
  initialState?: string
}

const RichTextEditor = ({ onChange, initialState = '' }: Props) => {
  const decorator = new CompositeDecorator([
    { strategy: findLinkEntities, component: Link },
  ])
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(convertToEditorState(initialState), decorator)
  )

  let className = `${styles.RichEditor_editor}`
  const contentState = editorState.getCurrentContent()
  if (!contentState.hasText()) {
    if (
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled'
    ) {
      className += ` ${styles.RichEditor_hidePlaceholder}`
    }
  }

  const handleAddImage = (imageUrl: string) => {
    const currentOffset = editorState
      .getCurrentContent()
      .getBlockMap()
      .keySeq()
      .findIndex(key => key === editorState.getSelection().getStartKey())

    // TODO: find out a better way to handle it
    // if editor is out of focus we force the image to be appended, not prepended
    const defEditorState =
      currentOffset === 0
        ? EditorState.moveFocusToEnd(editorState)
        : editorState

    const currentContentState = defEditorState.getCurrentContent()
    const contentStateWithEntity = currentContentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { src: imageUrl }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(defEditorState, {
      currentContent: contentStateWithEntity,
    })
    return setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    )
  }

  const handleAddLink = (linkUrl: string) => {
    const currentContentState = editorState.getCurrentContent()
    const contentStateWithEntity = currentContentState.createEntity(
      'LINK',
      'IMMUTABLE',
      { url: linkUrl }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    return setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    )
  }

  const handleChange = (state: EditorState) => {
    if (onChange) {
      onChange(convertToMarkdown(state))
    }

    return setEditorState(state)
  }

  const toggleBlockType = (blockType: string) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType))
  }

  const toggleInlineStyle = (inlineStyle: string) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  return (
    <div className="bw1 br2 b--solid b--muted-4">
      <div className="pa4 flex flex-wrap-s">
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <LinkInput onAdd={handleAddLink} />
        <ImageInput onAdd={handleAddImage} />
      </div>
      <div className={className}>
        <Editor
          editorState={editorState}
          onChange={state => handleChange(state)}
          blockRendererFn={mediaBlockRenderer}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
