import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import AvailableEditor from '../AvailableEditor'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

const TypographyEditor: React.FunctionComponent = () => {
  const title = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.typography.title"
      defaultMessage="Typography"
    />
  )

  defineMessages({
    fontFamilyTitle: {
      defaultMessage: 'Font Family',
      id: 'admin/pages.editor.styles.edit.font-family.title',
    },
  })

  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6">
        <AvailableEditor
          path={EditorPath.fontFamily}
          titleId="admin/pages.editor.styles.edit.font-family.title"
        />
        <AvailableEditor
          path={EditorPath.typeTokens}
          titleId="admin/pages.editor.styles.edit.type-tokens.title"
        />
      </div>
    </>
  )
}

export default TypographyEditor
