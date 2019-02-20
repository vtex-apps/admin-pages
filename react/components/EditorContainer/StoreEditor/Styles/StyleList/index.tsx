import { find } from 'ramda'
import React from 'react'
import { ButtonWithIcon, Spinner } from 'vtex.styleguide'

import Operations from './Operations'

import CreateNewIcon from './icons/CreateNewIcon'
import StyleCard from './StyleCard'

interface Props {
  startEditing: (style: Style) => void
  iframeWindow: Window
}

const StyleList: React.SFC<Props> = ({ startEditing, iframeWindow }) => {
  return (
    <Operations>
      {({
        listStyles: { data, loading },
        saveSelectedStyle,
        createStyle,
        deleteStyle,
      }) => {
        const listStyles = data && data.listStyles
        console.log({ listStyles })

        const selected = listStyles && find(style => style.selected, listStyles)
        if (selected) {
          updateStyleTag(selected.path, iframeWindow)
        }

        return loading ? (
          <div className="pt7 flex justify-around">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-column ph3 h-100">
            <div className="flex justify-between mv5 ml5 items-center">
              <span className="f3">Styles</span>
              <ButtonWithIcon
                icon={<CreateNewIcon />}
                variation="tertiary"
                onClick={() => createStyle({ variables: { name: 'Untitled' } })}
              >
                New
              </ButtonWithIcon>
            </div>
            <div className="flex flex-column flex-grow-1 overflow-scroll">
              {listStyles &&
                listStyles.map(style => (
                  <StyleCard
                    key={style.id}
                    style={style}
                    selectStyle={({ id }: Style) =>
                      saveSelectedStyle({ variables: { id } })
                    }
                    deleteStyle={({ id }: Style) =>
                      deleteStyle({ variables: { id } })
                    }
                    duplicateStyle={({ name, config }: Style) =>
                      createStyle({
                        variables: { name: `Copy of ${name}`, config },
                      })
                    }
                    startEditing={startEditing}
                  />
                ))}
            </div>
          </div>
        )
      }}
    </Operations>
  )
}

const updateStyleTag = (path: string, iframeWindow: Window) => {
  const styleLinkElement = iframeWindow.document.getElementById('style_link')
  if (styleLinkElement) {
    styleLinkElement.setAttribute('href', path)
  }
}

export default StyleList
