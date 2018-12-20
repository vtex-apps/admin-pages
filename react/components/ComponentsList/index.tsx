import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ToastConsumer } from 'vtex.styleguide'

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

  public render() {
    const { editor, highlightHandler, runtime: iframeRuntime } = this.props

    const components = getComponents(
      iframeRuntime.extensions,
      getIframeRenderComponents(),
      iframeRuntime.page,
      Object.keys(iframeRuntime.pages),
    )

    return (
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
    )
  }

  private handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>,
  ) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.highlightHandler(treePath)
  }

  private handleMouseLeave = () => {
    this.props.highlightHandler(null)
  }
}

export default ComponentsList
