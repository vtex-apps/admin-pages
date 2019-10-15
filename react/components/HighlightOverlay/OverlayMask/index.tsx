import React from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './OverlayMask.css'

interface Props {
  isActive: boolean
  style?: React.CSSProperties
}

const classNames = {
  enter: styles['overlay-mask-enter'],
  enterActive: styles['overlay-mask-enter-active'],
  enterDone: styles['overlay-mask-enter-done'],
  exit: styles['overlay-mask-exit'],
  exitActive: styles['overlay-mask-exit-active'],
  exitDone: styles['overlay-mask-exit-done'],
}

const timeout = {
  enter: 300,
  exit: 150,
}

export default function OverlayMask({ style, isActive }: Props) {
  const overlayMaskStyle: React.CSSProperties = isActive
    ? {}
    : { pointerEvents: 'none' }

  return (
    <CSSTransition
      mountOnEnter
      in={isActive}
      timeout={timeout}
      classNames={classNames}
    >
      <div
        className="absolute bg-base h-100 w-100"
        style={{ ...overlayMaskStyle, ...style }}
      />
    </CSSTransition>
  )
}
