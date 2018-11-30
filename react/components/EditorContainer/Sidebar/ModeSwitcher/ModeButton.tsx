import classnames from 'classnames'
import React from 'react'

import Content from '../../../icons/Content'
import Layout from '../../../icons/Layout'
import { IconProps } from '../../../icons/utils'

import styles from './styles.css'

interface Props {
  activeMode: EditorMode
  mode: EditorMode
  switchHandler: () => void
}

type ModeIcons = { [Key in EditorMode]: React.ComponentClass<IconProps> }

const modeIcons: ModeIcons = {
  content: Content,
  layout: Layout,
}

const ModeButton: React.SFC<Props> = ({ activeMode, mode, switchHandler }) => {
  const Icon = modeIcons[mode]

  const isActive = mode === activeMode

  const capitalizedMode = mode.substring(0, 1).toUpperCase() + mode.substring(1)

  return (
    <button
      className={classnames(
        {
          'b--rebel-pink': isActive,
          'c-muted-1 b--transparent hover-c-action-primary pointer': !isActive,
        },
        'bb-0 bg-transparent bl-0 bt-0 bw1 outline-0 pa4 relative v-mid w-100 flex items-center justify-center',
      )}
      disabled={isActive}
      onClick={switchHandler}
      value={mode}
    >
      <div className="bg-animate hover-bg-light-silver h2 w2 br-pill flex items-center justify-center">
        <div
          className={`${
            styles['hide-child']
          } hide-child absolute w-100 h-100 z-3`}
        >
          <span
            style={{ transform: 'translate3d(-100%, 1rem, 0)' }}
            className="white br1 dtc v-mid w-100 h-100 ph3 pv2 f7 child bg-black-70"
          >
            {capitalizedMode}
          </span>
        </div>
        <Icon
          size={24}
          color={isActive ? 'var(--near-black)' : 'var(--gray)'}
        />
      </div>
    </button>
  )
}

export default ModeButton
