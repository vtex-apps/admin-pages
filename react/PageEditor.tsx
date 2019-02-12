import PropTypes from 'prop-types'
import React, { Component } from 'react'

import EditorProvider from './components/EditorProvider'
import MessagesContext, { IMessagesContext } from './components/MessagesContext'

interface PageEditorProps {
  params: any
}

let messages = {}

class PageEditor extends Component<PageEditorProps, IMessagesContext> {
  public static propTypes = {
    children: PropTypes.element,
    data: PropTypes.object,
  }

  public static contextTypes = {
    prefetchPage: PropTypes.func,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
  }

  public static getCustomMessages = () => {
    return messages
  }

  constructor(props: PageEditorProps) {
    super(props)

    this.state = {
      setMessages: this.setMessages,
    }
  }

  public setMessages = (newMessages?: object) => {
    messages = newMessages || {}
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public componentDidUpdate() {
    this.context.stopLoading()
  }

  public render() {
    const { params } = this.props

    const path = params && params.path

    return (
      <div className="h-100 overflow-y-auto bg-light-silver">
        <MessagesContext.Provider value={this.state}>
          <EditorProvider>
            <iframe
              id="store-iframe"
              className="w-100 h-100"
              src={path ? `$/{path}` : '/'}
              frameBorder="0"
            />
          </EditorProvider>
        </MessagesContext.Provider>
      </div>
    )
  }
}

export default PageEditor
