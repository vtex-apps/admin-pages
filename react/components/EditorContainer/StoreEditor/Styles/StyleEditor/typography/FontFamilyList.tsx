import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import { Button } from 'vtex.styleguide'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

const FontFamilyList: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const title = (
    <FormattedMessage id="admin/pages.editor.styles.edit.font-family.title" />
  )
  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6 lh-copy">
        <p>
          <FormattedMessage id="admin/pages.editor.styles.edit.font-family.add-font-description" />
        </p>
        <Button
          collapseLeft
          variation="tertiary"
          onClick={() => history.push(EditorPath.customFont)}
        >
          <FormattedMessage id="admin/pages.editor.styles.edit.font-family.add-font" />
        </Button>
      </div>
    </>
  )
}

export default FontFamilyList
