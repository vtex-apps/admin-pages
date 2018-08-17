import PropTypes from 'prop-types'
import React, { Component } from 'react'

import EditorProvider from './EditorProvider'

interface PageEditorProps {
  params: any
}

class PageEditor extends Component<PageEditorProps> {
  public static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  public static contextTypes = {
    prefetchPage: PropTypes.func,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  public componentDidMount() {
    this.toggleLoading()
  }

  public componentDidUpdate() {
    this.toggleLoading()
  }

  public toggleLoading = () => {
    this.context.stopLoading()
  }

  public render() {
    const { params: { path } } = this.props

    return (
      <EditorProvider>
        <iframe
          id="store-iframe"
          className="w-100 h-100"
          src={['/', path].filter((str) => !!str).join('')}
          frameBorder="0"
        />
      </EditorProvider>
    )
  }
}

export default PageEditor
