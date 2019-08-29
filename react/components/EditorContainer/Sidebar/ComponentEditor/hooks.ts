import { useRef, useState } from 'react'
import { ComponentFormState } from './typings'

export function useComponentFormStateStack() {
  const [componentFormState, setComponentFormState] = useState<
    ComponentFormState | undefined
  >()
  const stack = useRef<ComponentFormState[]>([])

  function popComponentFormState() {
    const newState = stack.current.pop()

    setComponentFormState(newState)
  }

  function pushComponentFormState(state: ComponentFormState) {
    stack.current.push(state)

    setComponentFormState(state)
  }

  return {
    componentFormState,
    popComponentFormState,
    pushComponentFormState,
  }
}
