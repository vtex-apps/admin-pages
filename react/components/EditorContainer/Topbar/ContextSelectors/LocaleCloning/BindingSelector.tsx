import React, { FunctionComponent, useReducer } from 'react'
// TODO: IconWarning is not exported from vtex.styleguide?
// Need to investigate. Meanwhile, ts-ignore
// @ts-ignore
import { Checkbox, IconWarning, Tag } from 'vtex.styleguide'
import styles from './styles.css'

export interface LocaleSelectorItem {
  label: string
  checked: boolean
}

export interface BindingSelectorItem {
  label: string
  id: string
  supportedLocales?: LocaleSelectorItem[]
  checked: boolean
  overwritesPage?: boolean
  overwritesTemplate?: boolean
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
      payload: { bindingId: string; localeId?: string }
    }
  | {
      type: 'check-all' | 'uncheck-all'
    }

type BindingSelectorReducer = typeof reducer

const reducer = (
  state: BindingSelectorState,
  action: BindingSelectorAction
) => {
  switch (action.type) {
    case 'toggle': {
      const { bindingId, localeId } = action.payload

      return state.map(binding => {
        if (
          binding.id === bindingId &&
          !binding.disabled &&
          !binding.isCurrent
        ) {
          if (!localeId) {
            const supportedLocales = binding.supportedLocales || []
            const newSupportedLocales = supportedLocales.map(currentLocale => {
              if (binding.checked) {
                currentLocale.checked = false
              } else {
                currentLocale.checked = true
              }

              return currentLocale
            })

            return {
              ...binding,
              checked: !binding.checked,
              supportedLocales: newSupportedLocales,
            }
          } else {
            const supportedLocales = binding.supportedLocales || []
            const locale = supportedLocales?.find(
              locale => localeId === locale.label
            )
            const newSupportedLocales = supportedLocales.map(currentLocale => {
              if (currentLocale === locale) {
                currentLocale.checked = !currentLocale.checked
                return currentLocale
              }

              return currentLocale
            })

            const someLocaleChecked = supportedLocales.some(
              locale => locale.checked
            )

            return {
              ...binding,
              checked: someLocaleChecked,
              supportedLocales: newSupportedLocales,
            }
          }
        }
        return binding
      })
    }

    case 'set': {
      const { id, value } = action.payload

      return state.map(binding => {
        if (binding.id === id && !binding.disabled && !binding.isCurrent) {
          return {
            ...binding,
            checked: value,
          }
        }

        return binding
      })
    }

    case 'check-all':
      return state.map(binding => ({
        ...binding,
        checked: !binding.disabled && !binding.isCurrent,
        supportedLocales:
          binding.supportedLocales &&
          binding.supportedLocales.map(locale => {
            return {
              ...locale,
              checked: true,
            }
          }),
      }))

    case 'uncheck-all':
      return state.map(binding => ({
        ...binding,
        checked: false,
        supportedLocales:
          binding.supportedLocales &&
          binding.supportedLocales.map(locale => {
            return {
              ...locale,
              checked: false,
            }
          }),
      }))
    default:
      return state
  }
}

export const useBindingSelectorReducer = (bindings: BindingSelectorItem[]) => {
  return useReducer<BindingSelectorReducer>(reducer, bindings)
}

interface Props {
  reducer: [BindingSelectorState, React.Dispatch<BindingSelectorAction>]
  pathId: string
}

const BindingSelector: FunctionComponent<Props> = ({ reducer, pathId }) => {
  const [state, dispatch] = reducer

  const areSomeSelected = state.some(item => item.checked)
  const areAllSelected = state.every(
    item => item.checked || item.disabled || item.isCurrent
  )

  return (
    <>
      <div className="mb5">
        <Checkbox
          id="checkAll"
          label="All bindings and locales"
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
        {state.map(binding => (
          <li className="pv5">
            <div className={`${styles.checkBoxContainer}`}>
              <Checkbox
                id={binding.id}
                onChange={() =>
                  dispatch({
                    type: 'toggle',
                    payload: {
                      bindingId: binding.id,
                    },
                  })
                }
                label={
                  <>
                    Binding: {binding.label}
                    <span className="c-muted-2">{pathId}</span>
                    {binding.overwritesPage && !binding.isCurrent && (
                      <div className="f6 c-muted-1 dib ml4">
                        <Tag
                          bgColor="#F2F5FC"
                          color="#323845
"
                        >
                          New!
                        </Tag>
                      </div>
                    )}
                  </>
                }
                checked={binding.checked}
                disabled={binding.disabled || binding.isCurrent}
              />
            </div>

            {binding.supportedLocales &&
              binding.supportedLocales.length &&
              binding.overwritesPage && (
                <ul
                  className={`${styles.localesList} list pa0 ma0 mt2 ml6 c-muted-1`}
                >
                  {binding.supportedLocales.map(locale => (
                    <li className="db mb3">
                      <Checkbox
                        id={binding.id}
                        onChange={() =>
                          dispatch({
                            type: 'toggle',
                            payload: {
                              bindingId: binding.id,
                              localeId: locale.label,
                            },
                          })
                        }
                        label={locale.label}
                        checked={locale.checked}
                        disabled={binding.disabled || binding.isCurrent}
                      />
                    </li>
                  ))}
                </ul>
              )}

            {binding.supportedLocales &&
              binding.supportedLocales.length &&
              !binding.overwritesPage && (
                <ul className="list pa0 ma0 mt2 ml6 f6 c-muted-1">
                  <li className="dib">
                    Locales:{' '}
                    {binding.supportedLocales
                      .map(locale => locale.label)
                      .join(', ')}
                  </li>
                </ul>
              )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default BindingSelector
