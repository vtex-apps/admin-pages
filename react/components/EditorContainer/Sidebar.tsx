import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'

import SelectionIcon from '../../images/SelectionIcon.js'
import ComponentEditor from '../ComponentEditor'
import ComponentsList from '../ComponentsList'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  runtime: RenderContext
}

const Sidebar = ({ editor, highlightHandler, runtime }: Props) => (
  <div
    id="sidebar-vtex-editor"
    className="right-0-ns z-1 h-100 top-3em-ns calc--height-ns w-18em-ns fixed w-100 w-auto-ns"
  >
    <nav
      id="admin-sidebar"
      className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden fixed absolute-m w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
    >
      <div className="h-100 overflow-y-scroll">
        runtime ? ( editTreePath === null ? (
        <Fragment>
          <div className="flex justify-between items-center">
            <h3 className="near-black f5 mv0 pa5">
              <FormattedMessage id="pages.editor.components.title" />
            </h3>
            <div
              onClick={editor.toggleEditMode}
              className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
            >
              <span className="pr5 b--light-gray flex items-center">
                <SelectionIcon
                  stroke={editor.editMode ? '#368df7' : '#979899'}
                />
              </span>
            </div>
          </div>
          <ComponentsList
            editor={editor}
            highlightExtensionPoint={highlightHandler}
            runtime={runtime}
          />
        </Fragment>
        ) : (
        <ComponentEditor editor={editor} runtime={runtime} />) ) : (
        <div className="mt5 flex justify-center">
          <Spinner />
        </div>
        )
      </div>
    </nav>
  </div>
)

export default Sidebar
