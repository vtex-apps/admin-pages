import React, { Component } from 'react'

import { getIframeRenderComponents } from '../../../utils/components'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { FormMetaConsumer } from './FormMetaContext'
import { ModalConsumer } from './ModalContext'
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
    const prevRuntime = prevProps.iframeRuntime
    const currRuntime = this.props.iframeRuntime

    const prevPage = prevRuntime.page
    const currPage = currRuntime.page

    if (currPage !== prevPage) {
      this.resetComponents()
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
          updateSidebarComponents={this.updateComponents}
        />
      )
    }

    return (
      <FormMetaConsumer>
        {formMeta => (
          <ModalConsumer>
            {modal => (
              <ConfigurationList
                editor={editor}
                formMeta={formMeta}
                iframeRuntime={iframeRuntime}
                modal={modal}
              />
            )}
          </ModalConsumer>
        )}
      </FormMetaConsumer>
    )
  }

  private resetComponents = () => {
    const { iframeRuntime } = this.props

    this.setState({
      components: getComponents(
        iframeRuntime.extensions,
        getIframeRenderComponents(),
        iframeRuntime.page
      ),
    })
  }

  private updateComponents = (components: SidebarComponent[]) => {
    this.setState({ components })
  }
}

export default Content
