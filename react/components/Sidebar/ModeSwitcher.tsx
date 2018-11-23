import classnames from 'classnames'
import React from 'react'
import Content from '../icons/Content'
import Layout from '../icons/Layout'
import { IconProps } from '../icons/utils'

import styles from './modeSwitcher.css'

interface Props {
  editor: EditorContext
}

type ModeIcons = { [Key in EditorMode]: React.ComponentClass<IconProps> }

const modeIcons: ModeIcons = {
  content: Content,
  layout: Layout,
}

interface ModeProps {
  type: EditorMode
  mode: EditorMode
  setMode: EditorContext['setMode']
}

const Mode: React.SFC<ModeProps> = ({ type, mode, setMode }) => {
  const Icon = modeIcons[mode]
  const isActive = type === mode
  const firstLetterUpperCaseType =
    type.substring(0, 1).toUpperCase() + type.substring(1)
  return (
    <button
      className={classnames(
        {
          'b--action-primary': isActive,
          'c-muted-1 b--transparent hover-c-action-primary pointer': !isActive,
        },
        'bb-0 bg-transparent bl-0 bt-0 bw1 outline-0 pa4 relative v-mid w-100 flex items-center justify-center',
      )}
      value={type}
      onClick={() => setMode(type as EditorMode)}
    >
      <div className="bg-animate hover-bg-light-silver h2 w2 br-pill flex items-center justify-center">
        <Icon color={isActive ? '#134CD8' : undefined} />
        <div
          className={`${
            styles['hide-child']
          } hide-child absolute w-100 h-100 z-3`}
        >
          <span
            style={{ transform: 'translate3d(-100%, 1rem, 0)' }}
            className="white br1 dtc v-mid w-100 h-100 ph3 pv2 f7 child bg-black-70"
          >
            {firstLetterUpperCaseType}
          </span>
        </div>
      </div>
    </button>
  )
}

const modes: EditorMode[] = ['content', 'layout']

const ModeSwitcher = ({ editor: { mode, setMode } }: Props) => (
  <div className="pt5 pr1">
    {modes.map(current => (
      <Mode key={current} type={current} mode={mode} setMode={setMode} />
    ))}
  </div>
)

export default ModeSwitcher
