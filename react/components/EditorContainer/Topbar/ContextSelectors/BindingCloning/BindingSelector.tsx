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

export type BindingSelectorAction =
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
  | {
      type: 'set-initial'
      payload: BindingSelectorItem[]
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
    case 'set-initial': {
      return action.payload
    }
    default:
      return state
  }
}

export const setInitialBindingState = (bindings: BindingSelectorItem[]) => ({
  type: 'set-initial' as const,
  payload: bindings,
})

type BindingSelectorReducer = typeof reducer

export const useBindingSelectorReducer = () => {
  return useReducer<BindingSelectorReducer>(reducer, [])
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
    <table className="w-100">
      <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
        <tr className="w-100 truncate overflow-x-hidden">
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <Checkbox
              id="checkAll"
              onChange={() => {
                dispatch({
                  type: areAllSelected ? 'uncheck-all' : 'check-all',
                })
              }}
              checked={areAllSelected}
              partial={areSomeSelected}
            />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            Binding
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <span className="flex items-center">
              <IconWarning /> <p className="ml3-s">Warning</p>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {state.map(item => (
          <tr
            className={`w-100 truncate overflow-x-hidden ${
              item.checked ? 'bg-washed-blue' : ''
            }`}
            key={item.id}
          >
            <td className="v-mid pv0 tl bb b--muted-4 ph3 z1 pv4-s">
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
                checked={item.checked}
                disabled={item.disabled || item.isCurrent}
              />
            </td>
            <td className="v-mid pv0 tl bb b--muted-4 ph3 z1 pv4-s">
              <>
                {item.label}
                <span className="c-muted-2">{pathId}</span>
              </>
            </td>
            <td className="v-mid pv0 tl bb b--muted-4 ph3 z1 pv4-s">
              {item.overwrites && !item.isCurrent && (
                <div className="f6 c-muted-1 dib ml4">
                  <p>Page already exists</p>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BindingSelector
