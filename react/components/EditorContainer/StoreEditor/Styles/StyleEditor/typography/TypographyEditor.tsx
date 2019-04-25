import React from 'react'
import { FormattedMessage } from 'react-intl'

import AvailableEditor from '../AvailableEditor'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

const TypographyEditor: React.FunctionComponent = () => {
  const title = (
    <FormattedMessage id="admin/pages.editor.styles.edit.typography.title" />
  )
  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6">
        <AvailableEditor
          path={EditorPath.fontFamily}
          titleId="admin/pages.editor.styles.edit.font-family.title"
        />
      </div>
    </>
  )
}

export default TypographyEditor
