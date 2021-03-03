import React, { FunctionComponent, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { Binding } from '../typings'
import BindingCloningModal from './BindingCloningModal'

interface Props {
  bindings: Binding[],
  binding: Binding,
  iframeRuntime: RenderContext
}

const BindingCloning: FunctionComponent<Props> = ({ bindings, binding, iframeRuntime }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const route = iframeRuntime?.route?.path ?? ''
  const bindingId = binding?.id ?? ''

  // TODO: put icon on the button, as per design, and/or i18n
  return (
    <>
      <Button variation="secondary" size="small" onClick={() => {setModalOpen(true)}}>
        Duplicate to other bindings
      </Button>
      <BindingCloningModal
        iframeRuntime={iframeRuntime}
        isOpen={isModalOpen}
        onClose={() => {setModalOpen(false)}}
        bindings={bindings}
        currentBinding={binding}
        // The key guarantees the component will be updated on route or binding change
        key={`${route}${bindingId}`}
      />
    </>
  )
}

export default BindingCloning
