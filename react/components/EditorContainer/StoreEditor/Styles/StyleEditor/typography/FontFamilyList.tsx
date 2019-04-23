import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import { Button } from 'vtex.styleguide'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

interface Props extends RouteComponentProps {
  intl: InjectedIntl
}

const FontFamilyList: React.FunctionComponent<Props> = ({ intl, history }) => {
  const title = intl.formatMessage({
    id: 'pages.editor.styles.edit.font-family.title',
  })
  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6 lh-copy">
        <p>You can add custom font families to your store, let’s add some?</p>
        <Button
          collapseLeft
          variation="tertiary"
          onClick={() => history.push(EditorPath.customFont)}
        >
          ADD CUSTOM FONT
        </Button>
      </div>
    </>
  )
}

export default injectIntl(FontFamilyList)
