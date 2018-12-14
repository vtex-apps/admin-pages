import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ToastConsumer, ToastProvider } from 'vtex.styleguide'

import { getIframeRenderComponents } from '../../utils/components'

import SortableList from './SortableList'

import { getComponents } from './getComponents'

interface Props {
  highlightExtensionPoint: (treePath: string | null) => void
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
    this.props.highlightExtensionPoint(null)
  }

  public handleMouseEnter = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')
    this.props.highlightExtensionPoint(treePath as string)
  }

  public handleMouseLeave = () => {
    this.props.highlightExtensionPoint(null)
  }

  public render() {
    const {
      editor,
      highlightExtensionPoint,
      runtime: iframeRuntime,
    } = this.props

    return (
      <ToastProvider positioning="parent">
        <ToastConsumer>
          {({ showToast }) => (
            <SortableList
              components={getComponents(
                iframeRuntime.extensions,
                getIframeRenderComponents(),
                iframeRuntime.page,
                Object.keys(iframeRuntime.pages),
              )}
              editor={editor}
              iframeRuntime={iframeRuntime}
              highlightExtensionPoint={highlightExtensionPoint}
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
