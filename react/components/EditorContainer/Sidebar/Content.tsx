import React from 'react'
import { Spinner } from 'vtex.styleguide'

import { getIframeRenderComponents } from '../../../utils/components'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { FormMetaConsumer } from './FormMetaContext'
import { ModalConsumer } from './ModalContext'
import TemplateEditor from './TemplateEditor'
import { getComponents } from './utils'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

const Content: React.SFC<Props> = ({
  editor,
  highlightHandler,
  iframeRuntime,
}) => {
  if (!iframeRuntime) {
    return (
      <div className="mt5 flex justify-center">
        <Spinner />
      </div>
    )
  }

  const components = getComponents(
    iframeRuntime.extensions,
    getIframeRenderComponents(),
    iframeRuntime.page,
    Object.keys(iframeRuntime.pages)
  )

  if (editor.editTreePath === null) {
    return (
      <ComponentSelector
        components={components}
        editor={editor}
        highlightHandler={highlightHandler}
        iframeRuntime={iframeRuntime}
      />
    )
  }

  return (
    <FormMetaConsumer>
      {formMeta => (
        <ModalConsumer>
          {modal =>
            editor.mode === 'layout' ? (
              <TemplateEditor
                editor={editor}
                formMeta={formMeta}
                iframeRuntime={iframeRuntime}
                modal={modal}
              />
            ) : (
              <ConfigurationList
                editor={editor}
                formMeta={formMeta}
                iframeRuntime={iframeRuntime}
                modal={modal}
              />
            )
          }
        </ModalConsumer>
      )}
    </FormMetaConsumer>
  )
}

export default Content
