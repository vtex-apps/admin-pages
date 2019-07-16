import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { FontFamily } from '../queries/ListFontsQuery'
import { EditorPath, IdParam } from '../StyleEditorRouter'

interface Props extends RouteComponentProps {
  font: FontFamily
}

const FontFamilyList: React.FunctionComponent<Props> = ({ font, history }) => {
  return (
    <div
      className="pointer flex justify-between items-center pv6 bb b--muted-4"
      onClick={() =>
        history.push(
          EditorPath.customFontFile.replace(
            IdParam,
            encodeURIComponent(font.id as string)
          )
        )
      }
    >
      <span className="f4">{font.fontFamily}</span>
    </div>
  )
}

export default withRouter(FontFamilyList)
