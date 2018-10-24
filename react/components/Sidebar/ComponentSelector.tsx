import React, { Fragment } from 'react'

import SelectionIcon from '../../images/SelectionIcon.js'
import ComponentsList from '../ComponentsList'

import { FormattedMessage } from 'react-intl'


interface Props {
  editor: EditorContext
  runtime: RenderContext
  highlightExtensionPoint: (treePath: string | null) => void
}

const ComponentSelector = ({editor: {editMode, toggleEditMode}, editor, runtime, highlightExtensionPoint}: Props) => (
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
)

export default ComponentSelector
