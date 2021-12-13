import React, { FunctionComponent, useState } from 'react'
import { useKeydownFromClick } from 'keydown-from-click'
import { Tooltip } from 'vtex.styleguide'

import { useEditorContext } from '../../../../EditorContext'
import { useHover } from '../../hooks'
import CopyContent from '../../icons/CopyContent'
import { Binding } from '../typings'
import BindingCloningModal from './BindingCloningModal'
import { CloneContentProvider } from './CloneContentContext'

interface Props {
  bindings: Binding[]
  binding: Binding
  iframeRuntime: RenderContext
}

const BindingCloning: FunctionComponent<Props> = ({
  bindings,
  binding,
  iframeRuntime,
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const editor = useEditorContext()
  const { handleMouseEnter, handleMouseLeave, hover } = useHover()

  const handleClick = () => {
    setModalOpen(true)
  }

  const handleKeyPress = useKeydownFromClick(handleClick)

  const { route, binding: iframeBinding } = iframeRuntime ?? {}
  const { id: routeId, pageContext } = route ?? {}

  return (
    <>
      {/* TODO: i18n */}
      <Tooltip label="Clone content to other bindings" position="bottom">
        <button
          style={editor.mode === 'disabled' ? { cursor: 'wait' } : {}}
          className={`w2 h2 pa3 bg-white br2 b--transparent outline-0 pointer flex justify-center items-center ${
            editor.editMode || (hover && editor.mode !== 'disabled')
              ? 'c-action-primary'
              : 'c-on-disabled'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onKeyPress={handleKeyPress}
        >
          <CopyContent />
        </button>
      </Tooltip>
      <CloneContentProvider
        routeId={routeId}
        bindings={bindings}
        currentBinding={binding}
        pageContext={pageContext}
        iframeBinding={iframeBinding}
      >
        <BindingCloningModal
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
        />
      </CloneContentProvider>
    </>
  )
}

export default BindingCloning
