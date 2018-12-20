import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ToastConsumer, ToastProvider } from 'vtex.styleguide'

import { getIframeRenderComponents } from '../../utils/components'

import SortableList from './SortableList'

import { getComponents } from './getComponents'

interface Props {
  highlightHandler: (treePath: string | null) => void
}

class ComponentsList extends Component<
  Props & RenderContextProps & EditorContextProps
> {
  public static propTypes = {
    editor: PropTypes.object,
    runtime: PropTypes.object,
  }

  public onEdit = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.editor.editExtensionPoint(treePath as string)
    this.props.highlightHandler(null)
  }

  public handleMouseEnter = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.highlightHandler(treePath as string)
  }

  public handleMouseLeave = () => {
    this.props.highlightHandler(null)
  }

  public render() {
    const {
      editor,
      highlightHandler,
      runtime: iframeRuntime,
    } = this.props

    const components = getComponents(
      iframeRuntime.extensions,
      getIframeRenderComponents(),
      iframeRuntime.page,
      Object.keys(iframeRuntime.pages),
    )

    return (
      <ToastProvider positioning="parent">
        <ToastConsumer>
          {({ showToast }) => (
            <SortableList
              components={components}
              editor={editor}
              iframeRuntime={iframeRuntime}
              highlightHandler={highlightHandler}
              onMouseEnterComponent={this.handleMouseEnter}
              onMouseLeaveComponent={this.handleMouseLeave}
              showToast={showToast}
            />
          )}
        </ToastConsumer>
      </ToastProvider>
    )
  }
}

export default ComponentsList
