import React from 'react'

import { FormMetaContext, ModalContext } from '../typings'

import ModeButton from './ModeButton'

interface Props {
  editor: EditorContext
  formMeta: FormMetaContext
  modal: ModalContext
}

const modes: EditorMode[] = ['content', 'layout', 'style']

const ModeSwitcher = ({ editor, formMeta, modal }: Props) => (
  <div className="flex bb bl bw1 b--muted-5">
    {modes.map(mode => (
      <ModeButton
        activeMode={editor.mode}
        key={mode}
        mode={mode}
        switchHandler={() => {
          modeSwitchHandler(editor, formMeta, modal, mode)
        }}
      />
    ))}
  </div>
)

const modeSwitchHandler = (
  editor: EditorContext,
  formMeta: FormMetaContext,
  modal: ModalContext,
  newMode: EditorMode,
) => {
  if (formMeta.wasModified) {
    const oldCloseCallbackHandler = modal.closeCallbackHandler

    modal.setHandlers({
      closeCallbackHandler: () => {
        if (formMeta.getWasModified()) {
          modal.setHandlers({
            closeCallbackHandler: oldCloseCallbackHandler,
          })
        } else {
          editor.setMode(newMode)
        }
      },
    })

    modal.open()
  } else {
    editor.setMode(newMode)
  }
}

export default ModeSwitcher
