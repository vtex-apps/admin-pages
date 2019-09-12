import {
  AtomicBlockUtils,
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from 'draft-js'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'

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
import HeadingInput from './HeadingInput'
import StyleButton from './StyleButton'

import {
  convertToEditorState,
  convertToMarkdown,
  findLinkEntities,
  mediaBlockRenderer,
  styleBlockRenderer,
} from './utils'

const INLINE_STYLES = [
  {
    label: <IconBold />,
    style: 'BOLD',
    title: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.bold.title"
        defaultMessage="Bold"
      />
    ),
  },
  {
    label: <IconItalic />,
    style: 'ITALIC',
    title: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.italic.title"
        defaultMessage="Italic"
      />
    ),
  },
  {
    label: <IconUnderline />,
    style: 'UNDERLINE',
    title: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.underline.title"
        defaultMessage="Underline"
      />
    ),
  },
]

const BLOCK_TYPES = [
  {
    label: <IconUnorderedList />,
    style: 'unordered-list-item',
    title: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.unordered-list.title"
        defaultMessage="Unordered list"
      />
    ),
  },
  {
    label: <IconOrderedList />,
    style: 'ordered-list-item',
    title: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.ordered-list.title"
        defaultMessage="Ordered list"
      />
    ),
  },
]

interface BlockStyleControlsProps {
  editorState: EditorState
  onToggle: (blockType: string | null) => void
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
          title={type.title}
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
  onToggle: (inlineStyle: string | null) => void
}
const InlineStyleControls = (props: InlineStyleControlsProps) => {
  const { editorState } = props
  const currentStyle = editorState.getCurrentInlineStyle()

  return (
    <>
      {INLINE_STYLES.map((type, i) => (
        <StyleButton
          key={i}
          title={type.title}
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

  const getContentBlockType = () => {
    const selection = editorState.getSelection()
    return editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()
  }

  const getCurrentSelectionText = () => {
    const selectionState = editorState.getSelection()
    const anchorKey = selectionState.getAnchorKey()
    const currentContent = editorState.getCurrentContent()
    const currentContentBlock = currentContent.getBlockForKey(anchorKey)
    const start = selectionState.getStartOffset()
    const end = selectionState.getEndOffset()

    return currentContentBlock.getText().slice(start, end)
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

  const handleAddLink = (linkText: string, linkUrl: string) => {
    const selection = editorState.getSelection()
    let currentContentState = editorState.getCurrentContent()

    if (!getCurrentSelectionText()) {
      currentContentState = Modifier.insertText(
        currentContentState,
        selection,
        linkText
      )

      const newContentWithEntity = currentContentState.createEntity(
        'LINK',
        'MUTABLE',
        { url: linkUrl }
      )

      const entityKey = newContentWithEntity.getLastCreatedEntityKey()
      const anchorOffset = selection.getAnchorOffset()
      const newSelection = new SelectionState({
        anchorKey: selection.getAnchorKey(),
        anchorOffset,
        focusKey: selection.getAnchorKey(),
        focusOffset: anchorOffset + linkText.length,
      })

      const newContentWithLink = Modifier.applyEntity(
        newContentWithEntity,
        newSelection,
        entityKey
      )

      const withLinkText = EditorState.push(
        editorState,
        newContentWithLink,
        'insert-characters'
      )

      return setEditorState(
        EditorState.forceSelection(
          withLinkText,
          currentContentState.getSelectionAfter()
        )
      )
    }

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

  const toggleBlockType = (blockType: string | null) => {
    if (!blockType) return
    handleChange(RichUtils.toggleBlockType(editorState, blockType))
  }

  const toggleInlineStyle = (inlineStyle: string | null) => {
    if (!inlineStyle) return
    handleChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  return (
    <div className="bw1 br2 b--solid b--muted-4">
      <div className="pa4 flex flex-wrap-s">
        <HeadingInput
          onAdd={toggleBlockType}
          activeStyle={getContentBlockType()}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <LinkInput
          onAdd={handleAddLink}
          getCurrentSelection={getCurrentSelectionText}
        />
        <ImageInput onAdd={handleAddImage} />
      </div>
      <div className={className}>
        <Editor
          editorState={editorState}
          onChange={state => handleChange(state)}
          blockRendererFn={mediaBlockRenderer}
          blockStyleFn={styleBlockRenderer}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
