import React, { Component } from 'react'

import { getIframeRenderComponents } from '../../../utils/components'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { FormMetaConsumer } from './FormMetaContext'
import { ModalConsumer } from './ModalContext'
import TemplateEditor from './TemplateEditor'
import { SidebarComponent } from './typings'
import { getComponents } from './utils'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContext
}

interface State {
  components: SidebarComponent[]
}

class Content extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      components: getComponents(
        props.iframeRuntime.extensions,
        getIframeRenderComponents(),
        props.iframeRuntime.page
      ),
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const prevPage = prevProps.iframeRuntime.page
    const currPage = this.props.iframeRuntime.page

    if (currPage !== prevPage) {
      this.updateComponents()
    }
  }

  public render() {
    const { editor, highlightHandler, iframeRuntime } = this.props

    if (editor.editTreePath === null) {
      return (
        <ComponentSelector
          components={this.state.components}
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

  private updateComponents = () => {
    const { iframeRuntime } = this.props

    this.setState({
      components: getComponents(
        iframeRuntime.extensions,
        getIframeRenderComponents(),
        iframeRuntime.page
      ),
    })
  }
}

export default Content
