import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import ModeButton from './components/ModeButton'

const modes: StoreEditMode[] = ['theme']

interface Props {
  changeMode: (mode?: StoreEditMode) => void
  mode?: StoreEditMode
  urlPath: string
}

const Topbar: React.SFC<Props> = ({ changeMode, mode, urlPath }) => (
  <div className="ph5 f6 h-3em w-100 flex justify-between items-center">
    <div className="flex items-stretch">
      {mode ? (
        <Fragment>
          <ModeButton changeMode={changeMode} mode={undefined} />
          <ModeButton changeMode={changeMode} mode={mode} />
        </Fragment>
      ) : (
        <Fragment>
          {modes.map(buttonMode => (
            <ModeButton changeMode={changeMode} mode={buttonMode} />
          ))}
          <div className="flex items-center ml3 pl7 bw1 bl b--muted-5">
            <FormattedMessage id="pages.editor.container.editpath.label" />:
            <div className="pl3 c-muted-2">{urlPath}</div>
          </div>
        </Fragment>
      )}
    </div>
  </div>
)

export default Topbar
