import React, { useReducer } from 'react'
import { Button, IconArrowBack } from 'vtex.styleguide'

interface Props {
  initialState: NavigationInfo
  saveStyle: () => void
  children: (
    updateNavigation: React.Dispatch<NavigationUpdate>
  ) => React.ReactNode
}

type NavigationReducer = (
  prevState: NavigationInfo[],
  info: NavigationUpdate
) => NavigationInfo[]

const StyleEditorTools: React.SFC<Props> = ({
  children,
  initialState,
  saveStyle,
}) => {
  const [navigation, updateNavigation] = useReducer<NavigationReducer>(
    (state, update) => {
      const newInfo = update.info ? [update.info] : []

      switch (update.type) {
        case 'pop':
          return state.slice(0, -1)
        case 'update':
          return [...state.slice(0, -1), ...newInfo]
        default:
          return [...state, ...newInfo]
      }
    },
    [initialState]
  )

  const [navInfo] = navigation.slice(-1)
  const {
    backButton: { action, text },
    title,
  } = navInfo

  return (
    <div className="h-100 flex flex-column">
      <div className="mh6 mt6">
        <div
          className="pointer flex items-center"
          onClick={() => {
            action()
            updateNavigation({
              type: 'pop',
            })
          }}
        >
          <IconArrowBack />
          <span className="ml4">{text}</span>
        </div>
        <div className="flex justify-between items-center mv4">
          <span className="f3">{title}</span>
          <Button variation="tertiary" size="small" onClick={saveStyle}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-column flex-grow-1">
        {children(updateNavigation)}
      </div>
    </div>
  )
}

export default StyleEditorTools