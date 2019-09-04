import { useRef, useState } from 'react'
import { ComponentFormState } from './typings'

export function useComponentFormStateStack() {
  const [componentFormState, setComponentFormState] = useState<
    ComponentFormState | undefined
  >()
  const stack = useRef<ComponentFormState[]>([])

  function popComponentFormState() {
    stack.current.pop()

    setComponentFormState(stack.current[stack.current.length - 1])
  }

  function pushComponentFormState(state: ComponentFormState) {
    const stateWithDepth = { ...state, depth: stack.current.length + 1 }

    stack.current.push(stateWithDepth)
    setComponentFormState(stateWithDepth)
  }

  return {
    currentDepth: stack.current.length,
    componentFormState,
    popComponentFormState,
    pushComponentFormState,
  }
}
