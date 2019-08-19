import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { FontFamily } from '../queries/ListFontsQuery'
import { EditorPath, IdParam } from '../StyleEditorRouter'

interface Props extends RouteComponentProps {
  font: FontFamily
}

const FontFamilyEntry: React.FunctionComponent<Props> = ({ font, history }) => {
  const encodedId = React.useMemo(() => encodeURIComponent(font.id), [font.id])

  const isActive = React.useMemo(() => document.URL.includes(encodedId), [
    encodedId,
  ])

  const handleClick = React.useCallback(
    () => history.push(EditorPath.customFontFile.replace(IdParam, encodedId)),
    [encodedId, history]
  )

  const handleKeyDown = useKeydownFromClick(handleClick)

  return (
    <div
      aria-selected={isActive}
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="option"
      tabIndex={0}
    >
      <span className="f4">{font.fontFamily}</span>
    </div>
  )
}

export default withRouter(FontFamilyEntry)
