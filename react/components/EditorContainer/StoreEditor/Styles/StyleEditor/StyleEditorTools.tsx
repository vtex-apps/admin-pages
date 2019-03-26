import React, { useReducer, useState } from 'react'
import { Button, IconArrowBack, Input } from 'vtex.styleguide'

interface Props {
  initialState: NavigationInfo
  saveStyle: () => void
  children: (
    updateNavigation: React.Dispatch<NavigationUpdate>
  ) => React.ReactNode
  setName: (name: string) => void
}

type NavigationReducer = (
  prevState: NavigationInfo[],
  info: NavigationUpdate
) => NavigationInfo[]

const StyleEditorTools: React.FunctionComponent<Props> = ({
  children,
  initialState,
  saveStyle,
  setName,
}) => {
  const [editing, setEditing] = useState(false)
  const [navigation, updateNavigation] = useReducer<NavigationReducer>(
    (state, update) => {
      const newInfo = update.info ? [update.info] : []
      if (update.type === 'pop' || update.type === 'push') {
        setEditing(false)
      }

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
        <div className="flex">
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
        </div>
        <div className="flex justify-between items-center mv4">
          {editing && navigation.length === 1 ? (
            <Input
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newTitle = event.target.value
                setName(newTitle)
                updateNavigation({
                  info: {
                    ...navInfo,
                    title: newTitle,
                  },
                  type: 'update',
                })
              }}
            />
          ) : (
            <span className="f3" onDoubleClick={() => setEditing(true)}>
              {title}
            </span>
          )}
          <Button
            variation="tertiary"
            size="small"
            onClick={() => {
              setEditing(false)
              saveStyle()
            }}
          >
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
