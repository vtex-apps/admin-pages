import React, { Component } from 'react'
import { ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { getIframeRenderComponents } from '../../../utils/components'

import ComponentSelector from './ComponentSelector'
import ConfigurationList from './ConfigurationList'
import { FormMetaConsumer } from './FormMetaContext'
import { ModalConsumer } from './ModalContext'
import { SidebarComponent } from './typings'
import { getComponents, getIsSitewide } from './utils'
import ListContentQuery from '../queries/ListContent'

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

    const prevPath = prevRuntime.route.path
    const currPath = currRuntime.route.path

    if (prevPath !== currPath) {
      this.resetComponents()
      this.props.editor.setIsLoading(false)
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

    const isSitewide = getIsSitewide(
      iframeRuntime.extensions,
      editor.editTreePath
    )

    const template = isSitewide
      ? '*'
      : iframeRuntime.pages[iframeRuntime.page].blockId

    const treePath = isSitewide
      ? getSitewideTreePath(editor.editTreePath)
      : editor.editTreePath!

    return (
      <FormMetaConsumer>
        {formMeta => (
          <ModalConsumer>
            {modal => (
              <ToastConsumer>
                {({ showToast }) => (
                  <ListContentQuery
                    variables={{
                      pageContext: iframeRuntime.route.pageContext,
                      template,
                      treePath,
                    }}
                  >
                    {listContentQueryResult => (
                      <ConfigurationList
                        editor={editor}
                        formMeta={formMeta}
                        iframeRuntime={iframeRuntime}
                        listContent={listContentQueryResult}
                        isSitewide={isSitewide}
                        modal={modal}
                        showToast={showToast}
                        template={template}
                        treePath={treePath}
                      />
                    )}
                  </ListContentQuery>
                )}
              </ToastConsumer>
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
