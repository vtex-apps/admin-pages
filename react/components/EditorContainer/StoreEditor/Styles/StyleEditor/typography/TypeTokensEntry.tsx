import React from 'react'
import { RouteComponentProps } from 'react-router'

import startCase from 'lodash/startCase'

import { EditorPath, IdParam } from '../StyleEditorRouter'

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
      <span className="f4">{startCase(name)}</span>
    </div>
  )
}

export default TypeTokenEntry
