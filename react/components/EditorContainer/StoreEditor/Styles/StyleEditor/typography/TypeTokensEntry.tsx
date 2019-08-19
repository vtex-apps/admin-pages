import { useKeydownFromClick } from 'keydown-from-click'
import startCase from 'lodash/startCase'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import { EditorPath, IdParam } from '../StyleEditorRouter'

interface EntryProps {
  name: string
  history: RouteComponentProps['history']
}

const TypeTokenEntry: React.FunctionComponent<EntryProps> = ({
  name,
  history,
}) => {
  const handleClick = React.useCallback(
    () => history.push(EditorPath.typeToken.replace(IdParam, name)),
    [history, name]
  )

  const handleKeyDown = useKeydownFromClick(handleClick)

  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="f4">{startCase(name)}</span>
    </div>
  )
}

export default TypeTokenEntry
