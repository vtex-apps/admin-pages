import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import SelectionIcon from '../../../images/SelectionIcon'
import ModeButton from './components/ModeButton'

const modes: StoreEditMode[] = ['settings', 'theme']

interface Props {
  changeMode: (mode?: StoreEditMode) => void
  isEditMode: boolean
  mode?: StoreEditMode
  toggleEditMode: () => void
  urlPath: string
}

const Topbar: React.FunctionComponent<Props> = ({
  changeMode,
  isEditMode,
  mode,
  toggleEditMode,
  urlPath,
}) => (
  <div className="pl5 f6 h-3em w-100 flex justify-between items-center">
    <div className="flex items-stretch w-100">
      {mode ? (
        <Fragment>
          <ModeButton changeMode={changeMode} mode={undefined} />
          <ModeButton changeMode={changeMode} mode={mode} />
        </Fragment>
      ) : (
        <Fragment>
          {modes.map(buttonMode => (
            <ModeButton
              key={buttonMode}
              changeMode={changeMode}
              mode={buttonMode}
            />
          ))}
          <div className="flex items-center mv4 pl5 bw1 bl b--muted-5">
            <FormattedMessage id="pages.editor.container.editpath.label" />:
            <div className="pl3 c-muted-2">{urlPath}</div>
          </div>
          <div
            onClick={toggleEditMode}
            className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
          >
            <span className="pr5 b--light-gray flex items-center">
              <SelectionIcon stroke={isEditMode ? '#368df7' : '#979899'} />
            </span>
          </div>
        </Fragment>
      )}
    </div>
  </div>
)

export default Topbar
