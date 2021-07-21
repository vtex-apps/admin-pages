import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { COMMON_PROPS } from '../consts'
import { ExitProps } from '../typings'
import styles from './styles.css'

const Exit: React.FC<ExitProps> = ({ children, condition, to }) => (
  <CSSTransition
    {...COMMON_PROPS}
    classNames={{
      exit: styles[`transition-editor-exit-${to}`],
      exitActive: styles[`transition-editor-exit-${to}-active`],
      exitDone: styles[`transition-editor-exit-${to}-done`],
    }}
    in={!condition}
    unmountOnExit
  >
    {children}
  </CSSTransition>
)

export default React.memo(Exit)
