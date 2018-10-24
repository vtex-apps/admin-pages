import React, { Component, Fragment } from 'react'

import ComponentEditor from '../ComponentEditor'
import ComponentSelector from './ComponentSelector'

import { Spinner } from 'vtex.styleguide'

interface Props {
  editor: EditorContext
  runtime: RenderContext | null
  highlightExtensionPoint: (treePath: string | null) => void
}

export default class Sidebar extends Component<Props> {
  public render() {
    return (
      <div
        id="sidebar-vtex-editor"
        className="right-0-ns z-1 h-100 top-3em-ns calc--height-ns w-18em-ns fixed w-100 w-auto-ns"
      >
        <nav
          id="admin-sidebar"
          className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden fixed absolute-m w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
        >
          <div className="h-100 overflow-y-scroll">
            {this.renderSideBarContent()}
          </div>
        </nav>
      </div>
    )
  }

  private renderSideBarContent() {
    const {
      editor: { editTreePath },
      editor,
      runtime,
      highlightExtensionPoint,
    } = this.props

    if (!runtime) {
      return (
        <div className="mt5 flex justify-center">
          <Spinner />
        </div>
      )
    }

    if (editTreePath === null) {
      return <ComponentSelector editor={editor} runtime={runtime} highlightExtensionPoint={highlightExtensionPoint} />
    }

    return <ComponentEditor editor={editor} runtime={runtime} />
  }
}
