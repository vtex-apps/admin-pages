import React, { useMemo } from 'react'
import { animated, Transition } from 'react-spring/renderprops'

interface Props {
  isOpen: boolean
  children: React.ReactElement<{ formData: number }> | React.ReactNode
}

const ExpandableItemContent: React.FC<Props> = ({ isOpen, children }) => {
  const TransitionChildren = useMemo(
    () => (_: string) => (style: React.CSSProperties) => (
      <animated.div style={style}>{children}</animated.div>
    ),
    [children]
  )

  return (
    <div
      className={`accordion-content ${isOpen ? 'accordion-content--open' : ''}`}
    >
      <Transition
        native
        config={{ duration: 300 }}
        items={isOpen ? ['children'] : []}
        from={{ opacity: 0, height: 0 }}
        enter={{ opacity: 1, height: 'auto' }}
        leave={{ opacity: 0, height: 0 }}
      >
        {TransitionChildren}
      </Transition>
    </div>
  )
}

export default React.memo(ExpandableItemContent)
