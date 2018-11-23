import React, { Component } from 'react'

import ComponentEditor from '../ComponentEditor'
import ComponentSelector from './ComponentSelector'
import ModeSwitcher from './ModeSwitcher'

import { Spinner } from 'vtex.styleguide'

interface Props {
  editor: EditorContext
  runtime: RenderContext | null
  highlightExtensionPoint: (treePath: string | null) => void
}

export default class Sidebar extends Component<Props> {
  public render() {
    const { editor } = this.props
    return (
      <div
        id="sidebar-vtex-editor"
        className="z-1 h-100 top-3em-ns calc--height-ns w-18em-ns w-100 w-auto-ns flex flex-row-reverse"
      >
        <ModeSwitcher editor={editor} />
        <nav
          id="admin-sidebar"
          className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
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
