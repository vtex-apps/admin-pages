import React from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'

import { Button } from 'vtex.styleguide'
import StyleEditorHeader from '../StyleEditorHeader'

interface Props {
  intl: InjectedIntl
}

const FontFamilyList: React.FunctionComponent<Props> = ({ intl }) => {
  const title = intl.formatMessage({
    id: 'pages.editor.styles.edit.font-family.title',
  })
  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6 lh-copy">
        <p>You can add custom font families to your store, let’s add some?</p>
        <Button collapseLeft variation="tertiary">
          ADD CUSTOM FONT
        </Button>
      </div>
    </>
  )
}

export default injectIntl(FontFamilyList)
