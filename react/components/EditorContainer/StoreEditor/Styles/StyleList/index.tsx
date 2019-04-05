import { find, zip } from 'ramda'
import React, { useState } from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { ButtonWithIcon, Spinner, ToastConsumer } from 'vtex.styleguide'

import Operations from './Operations'

import CreateNewIcon from './icons/CreateNewIcon'
import StyleCard from './StyleCard'

interface Props {
  startEditing: (style: Style) => void
  setStyleAsset: (asset: StyleAssetInfo) => void
  intl: InjectedIntl
}

const compareStyles = (a: Style, b: Style) => {
  const toArray = ({ selected, editable, app, name, id }: Style) => {
    return [selected ? 0 : 1, editable ? 0 : 1, app, name, id]
  }
  return zip(toArray(a), toArray(b)).reduce((acc, [value1, value2]) => {
    if (acc !== 0) {
      return acc
    }
    if (value1 < value2) {
      return -1
    }
    if (value1 > value2) {
      return 1
    }
    return acc
  }, 0)
}

const StyleList: React.FunctionComponent<Props> = ({
  intl,
  startEditing,
  setStyleAsset,
}) => {
  const [isCreatingStyle, setIsCreatingStyle] = useState(false)

  return (
    <Operations>
      {({
        listStyles: { data, loading },
        saveSelectedStyle,
        createStyle,
        deleteStyle,
      }) => {
        const unsortedStyles = data && data.listStyles
        const listStyles = unsortedStyles && unsortedStyles.sort(compareStyles)

        const selected = listStyles && find(style => style.selected, listStyles)
        if (selected && !loading) {
          setStyleAsset({ type: 'path', selected: true, value: selected.path })
        }

        return loading ? (
          <div className="pt7 flex justify-around">
            <Spinner />
          </div>
        ) : (
          <ToastConsumer>
            {({ showToast }) => (
              <section className="flex flex-column ph3 h-100 overflow-x-hidden">
                <header className="flex justify-between pv5 pl5 items-center flex-shrink-0 bg-white z-1">
                  <h1 className="f3 fw4">
                    {intl.formatMessage({
                      id: 'pages.editor.styles.header.title',
                    })}
                  </h1>
                  <ButtonWithIcon
                    icon={<CreateNewIcon />}
                    variation="tertiary"
                    isLoading={isCreatingStyle}
                    onClick={() => {
                      setIsCreatingStyle(true)
                      createStyle({
                        variables: {
                          name: intl.formatMessage({
                            id: 'pages.editor.styles.new.defaultName',
                          }),
                        },
                      })
                        .then(() => {
                          showToast({
                            horizontalPosition: 'right',
                            message: intl.formatMessage({
                              id: 'pages.editor.styles.new.success',
                            }),
                          })
                        })
                        .catch(e => {
                          console.error(e)
                          showToast({
                            horizontalPosition: 'right',
                            message: intl.formatMessage({
                              id: 'pages.editor.styles.new.fail',
                            }),
                          })
                        })
                        .finally(() => setIsCreatingStyle(false))
                    }}
                  >
                    {intl.formatMessage({
                      id: 'pages.editor.styles.new-button.text',
                    })}
                  </ButtonWithIcon>
                </header>
                <div className="flex flex-column flex-grow-1 overflow-y-auto">
                  {listStyles &&
                    listStyles.map(style => (
                      <StyleCard
                        key={style.id}
                        style={style}
                        selectStyle={({ id, name }: Style) =>
                          saveSelectedStyle({ variables: { id } })
                            .then(() => {
                              showToast({
                                horizontalPosition: 'right',
                                message: intl.formatMessage(
                                  {
                                    id:
                                      'pages.editor.styles.select.save-success',
                                  },
                                  { name }
                                ),
                              })
                            })
                            .catch(e => {
                              console.error(e)
                              showToast({
                                horizontalPosition: 'right',
                                message: intl.formatMessage(
                                  {
                                    id: 'pages.editor.styles.select.save-fail',
                                  },
                                  { name }
                                ),
                              })
                            })
                        }
                        deleteStyle={({ config, name, id }: Style) =>
                          deleteStyle({ variables: { id } })
                            .then(() => {
                              showToast({
                                action: {
                                  label: intl.formatMessage({
                                    id:
                                      'pages.editor.styles.select.delete.toast.undo',
                                  }),
                                  onClick: () => {
                                    createStyle({ variables: { name, config } })
                                  },
                                },
                                duration: Infinity,
                                horizontalPosition: 'right',
                                message: intl.formatMessage(
                                  {
                                    id:
                                      'pages.editor.styles.select.delete-success',
                                  },
                                  { name }
                                ),
                              })
                            })
                            .catch(e => {
                              console.error(e)
                              showToast({
                                horizontalPosition: 'right',
                                message: intl.formatMessage({
                                  id:
                                    'pages.editor.styles.card.menu.delete.fail',
                                }),
                              })
                              throw e
                            })
                        }
                        duplicateStyle={({ name, config }: Style) =>
                          createStyle({
                            variables: {
                              config,
                              name: intl.formatMessage(
                                {
                                  id:
                                    'pages.editor.styles.duplicate.defaultName',
                                },
                                { name }
                              ),
                            },
                          })
                            .then(() => {
                              showToast({
                                horizontalPosition: 'right',
                                message: intl.formatMessage(
                                  {
                                    id:
                                      'pages.editor.styles.card.menu.duplicate.success',
                                  },
                                  { name }
                                ),
                              })
                            })
                            .catch(e => {
                              console.error(e)
                              showToast({
                                horizontalPosition: 'right',
                                message: intl.formatMessage(
                                  {
                                    id:
                                      'pages.editor.styles.card.menu.duplicate.fail',
                                  },
                                  { name }
                                ),
                              })
                            })
                        }
                        startEditing={startEditing}
                      />
                    ))}
                </div>
              </section>
            )}
          </ToastConsumer>
        )
      }}
    </Operations>
  )
}

export default injectIntl(StyleList)
