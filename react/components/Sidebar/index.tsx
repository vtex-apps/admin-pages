import React, { Component, Fragment } from 'react'

import SelectionIcon from '../../images/SelectionIcon.js'
import ComponentEditor from '../ComponentEditor'
import ComponentsList from '../ComponentsList'

import { FormattedMessage } from 'react-intl'
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
      editor: { editTreePath, editMode, toggleEditMode },
      editor,
      runtime,
      highlightExtensionPoint,
    } = this.props

    return runtime ? (
      editTreePath === null ? (
        <Fragment>
          <div className="flex justify-between items-center">
            <h3 className="near-black f5 mv0 pa5">
              <FormattedMessage id="pages.editor.components.title" />
            </h3>
            <div
              onClick={toggleEditMode}
              className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
            >
              <span className="pr5 b--light-gray flex items-center">
                <SelectionIcon stroke={editMode ? '#368df7' : '#979899'} />
              </span>
            </div>
          </div>
          <ComponentsList
            editor={editor}
            runtime={runtime}
            highlightExtensionPoint={highlightExtensionPoint}
          />
        </Fragment>
      ) : (
        <ComponentEditor editor={editor} runtime={runtime} />
      )
    ) : (
      <div className="mt5 flex justify-center">
        <Spinner />
      </div>
    )
  }
}
