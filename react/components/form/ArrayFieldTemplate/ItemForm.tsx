import classnames from 'classnames'
import React from 'react'
import { animated, useTransition } from 'react-spring'

interface Props {
  shouldShow: boolean
  children: React.ReactElement
}

const ItemForm: React.FC<Props> = props => {
  const transitions = useTransition(props.shouldShow, null, {
    enter: { transform: 'translateX(0rem)', overflow: 'unset' },
    from: { transform: 'translateX(18rem)', overflow: 'hidden' },
    leave: { transform: 'translateX(18rem)', overflow: 'hidden' },
    unique: true,
  })

  return (
    <>
      {transitions.map(({ item, key, props: style }) =>
        item ? (
          <animated.div
            key={key}
            className={classnames(
              'accordion-item bg-white bb b--light-silver absolute left-0 top-0 ph6 w-100 h-100 z-1'
            )}
            style={style}
          >
            {props.children}
          </animated.div>
        ) : null
      )}
    </>
  )
}

export default React.memo(ItemForm)
