import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { COMMON_PROPS } from '../consts'
import { EnterProps } from '../typings'

import styles from './styles.css'

const Enter: React.FC<EnterProps> = ({ children, condition, from }) => (
  <CSSTransition
    {...COMMON_PROPS}
    appear
    classNames={{
      appear: styles[`transition-editor-enter-${from}`],
      appearActive: styles[`transition-editor-enter-${from}-active`],
      enter: styles[`transition-editor-enter-${from}`],
      enterActive: styles[`transition-editor-enter-${from}-active`],
    }}
    in={condition}
    mountOnEnter
  >
    {children}
  </CSSTransition>
)

export default React.memo(Enter)
