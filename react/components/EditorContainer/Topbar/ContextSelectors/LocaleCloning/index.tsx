import React, { FunctionComponent, useState } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { Binding } from '../typings'
import LocaleCloningModal from './LocaleCloningModal'
import IconLocale from '../../icons/IconLocale'
import { useEditorContext } from '../../../../EditorContext'

interface Props {
  bindings: Binding[]
  binding: Binding
  iframeRuntime: RenderContext
}

const LocaleCloning: FunctionComponent<Props> = ({
  bindings,
  binding,
  iframeRuntime,
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const editor = useEditorContext()

  const route = iframeRuntime?.route?.path ?? ''
  const bindingId = binding?.id ?? ''

  // TODO: put icon on the button, as per design, and/or i18n
  return (
    <div className="ml6">
      <div style={editor.mode === 'disabled' ? { cursor: 'wait' } : {}}>
        <ButtonWithIcon
          icon={<IconLocale color="#134CD8" />}
          variation="tertiary"
          size="small"
          onClick={() => {
            setModalOpen(true)
          }}
        >
          Duplicate
        </ButtonWithIcon>
      </div>

      <LocaleCloningModal
        iframeRuntime={iframeRuntime}
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        bindings={bindings}
        currentBinding={binding}
        // The key guarantees the component will be updated on route or binding change
        key={`${route}${bindingId}`}
      />
    </div>
  )
}

export default LocaleCloning
