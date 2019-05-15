import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import { prettify } from '../utils/typography'

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
          <TypeTokenEntry name={name} history={history} />
        ))}
      </div>
    </>
  )
}

interface EntryProps {
  name: string
  history: RouteComponentProps['history']
}

const TypeTokenEntry: React.FunctionComponent<EntryProps> = ({
  name,
  history,
}) => {
  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={() => history.push(EditorPath.typeToken.replace(IdParam, name))}
    >
      <span className="f4">{prettify(name)}</span>
    </div>
  )
}

export default TypeTokensList
