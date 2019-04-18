import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

import AvailableEditor from '../AvailableEditor'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

interface Props {
  intl: InjectedIntl
}

const TypographyEditor: React.FunctionComponent<Props> = ({ intl }) => {
  const title = intl.formatMessage({
    id: 'pages.editor.styles.edit.typography.title',
  })
  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6">
        <AvailableEditor
          path={EditorPath.fontFamily}
          titleId="pages.editor.styles.edit.font-family.title"
        />
      </div>
    </>
  )
}

export default injectIntl(TypographyEditor)
