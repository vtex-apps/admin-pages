import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import StyleEditorHeader from '../StyleEditorHeader'
import TypeTokenEntry from './TypeTokensEntry'

interface Props extends RouteComponentProps {
  style: Style
}

const TypeTokensList: React.FunctionComponent<Props> = ({ history, style }) => {
  const title = (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.type-tokens.title"
      defaultMessage="Type Tokens"
    />
  )

  const { styles } = style.config.typography
  const tokens = Object.entries(styles)
    .filter(([name]) => !name.startsWith('__'))
    .map(([name, value]) => ({ ...value, name }))

  return (
    <>
      <StyleEditorHeader title={title} />
      <div className="ph6">
        {tokens.map(({ name }) => (
          <TypeTokenEntry name={name} key={name} history={history} />
        ))}
      </div>
    </>
  )
}

export default TypeTokensList
