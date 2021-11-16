import React, { FunctionComponent, useReducer } from 'react'
import { Checkbox, IconWarning } from 'vtex.styleguide'

export interface BindingSelectorItem {
  label: string
  id: string
  supportedLocales?: string[]
  checked: boolean
  overwrites?: boolean
  isCurrent?: boolean
  disabled?: boolean
}

export type BindingSelectorState = BindingSelectorItem[]

type BindingSelectorAction =
  | {
      type: 'set'
      payload: {
        id: string
        value: boolean
      }
    }
  | {
      type: 'toggle'
      payload: { id: string }
    }
  | {
      type: 'check-all' | 'uncheck-all'
    }

const reducer = (
  state: BindingSelectorState,
  action: BindingSelectorAction
) => {
  switch (action.type) {
    case 'toggle': {
      const { id } = action.payload

      return state.map(item => {
        if (item.id === id && !item.disabled && !item.isCurrent) {
          return {
            ...item,
            checked: !item.checked,
          }
        }

        return item
      })
    }
    case 'set': {
      const { id, value } = action.payload

      return state.map(item => {
        if (item.id === id && !item.disabled && !item.isCurrent) {
          return {
            ...item,
            checked: value,
          }
        }

        return item
      })
    }
    case 'check-all':
      return state.map(item => ({
        ...item,
        checked: !item.disabled && !item.isCurrent,
      }))
    case 'uncheck-all':
      return state.map(item => ({
        ...item,
        checked: false,
      }))
    default:
      return state
  }
}

type BindingSelectorReducer = typeof reducer

export const useBindingSelectorReducer = (bindings: BindingSelectorItem[]) => {
  return useReducer<BindingSelectorReducer>(reducer, bindings)
}

interface Props {
  reducer: [BindingSelectorState, React.Dispatch<BindingSelectorAction>]
  pathId: string
}

const BindingSelector: FunctionComponent<Props> = ({ reducer, pathId }) => {
  const [state, dispatch] = reducer
  const areAllSelected = state.every(
    item => item.checked || item.disabled || item.isCurrent
  )
  const areSomeSelected = state.some(item => item.checked)

  return (
    <>
      <div className="mb5">
        <Checkbox
          id="checkAll"
          label="All bindings and locations"
          onChange={() => {
            dispatch({
              type: areAllSelected ? 'uncheck-all' : 'check-all',
            })
          }}
          checked={areAllSelected}
          partial={areSomeSelected}
        />
      </div>
      <ul className="list pa0 ma0 pl6">
        {state.map(item => (
          <li className="mb5" key={item.id}>
            <div>
              <Checkbox
                id={item.id}
                onChange={() =>
                  dispatch({
                    type: 'toggle',
                    payload: {
                      id: item.id,
                    },
                  })
                }
                label={
                  <>
                    {item.label}
                    <span className="c-muted-2">{pathId}</span>
                    {item.overwrites && !item.isCurrent && (
                      <div className="f6 c-muted-1 dib ml4">
                        <IconWarning /> Page already exists
                      </div>
                    )}
                  </>
                }
                checked={item.checked}
                disabled={item.disabled || item.isCurrent}
              />
            </div>
            {item.supportedLocales && item.supportedLocales.length > 1 && (
              <ul className="list pa0 ma0 mt2 ml6 f6 c-muted-1">
                {item.supportedLocales.map((locale, i, arr) => (
                  <li className="dib" key={locale}>
                    {locale}
                    {i < arr.length - 1 && <span>, </span>}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default BindingSelector
