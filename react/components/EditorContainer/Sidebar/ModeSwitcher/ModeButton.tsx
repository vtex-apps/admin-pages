import classnames from 'classnames'
import React from 'react'

import styles from './styles.css'

interface Props {
  activeMode: EditorMode
  mode: EditorMode
  switchHandler: () => void
}

const ModeButton: React.SFC<Props> = ({ activeMode, mode, switchHandler }) => {
  const isActive = mode === activeMode

  const capitalizedMode = mode.substring(0, 1).toUpperCase() + mode.substring(1)

  return (
    <button
      className={classnames(
        {
          'c-muted-2 b--transparent hover-c-action-primary pointer': !isActive,
          'c-on-base b--emphasis': isActive,
        },
        'bg-transparent bl-0 bt-0 br-0 bw1 outline-0 pb4 pt5 relative v-mid w-100 flex items-center justify-center',
      )}
      disabled={isActive}
      onClick={switchHandler}
      value={mode}
    >
      <div className="pl2 f6 fw5 ">
        {capitalizedMode}
      </div>
    </button>
  )
}

export default ModeButton
