import { find, zip } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { ButtonWithIcon, Spinner, ToastConsumer } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import Operations from './Operations'
import CreateNewIcon from './icons/CreateNewIcon'
import StyleCard from './StyleCard'
import { createEventObject } from '../../../../utils/auditEvents'
import SendEventToAuditMutation from '../../mutations/SendEventToAudit'

interface Props {
  startEditing: (style: Style) => void
  setStyleAsset: (asset: StyleAssetInfo) => void
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

const messages = defineMessages({
  defaultName: {
    defaultMessage: 'Untitled',
    id: 'admin/pages.editor.styles.new.defaultName',
  },
  deleteFail: {
    defaultMessage: 'Failed to delete style.',
    id: 'admin/pages.editor.styles.card.menu.delete.fail',
  },
  deleteSuccess: {
    defaultMessage: `Style '{name}' was deleted.`,
    id: 'admin/pages.editor.styles.select.delete-success',
  },
  duplicateDefaultName: {
    defaultMessage: 'Copy of {name}',
    id: 'admin/pages.editor.styles.duplicate.defaultName',
  },
  duplicateFail: {
    defaultMessage: `Failed to duplicate style '{name}'.`,
    id: 'admin/pages.editor.styles.card.menu.duplicate.fail',
  },
  duplicateSuccess: {
    defaultMessage: `Style '{name}' was duplicated.`,
    id: 'admin/pages.editor.styles.card.menu.duplicate.success',
  },
  newFail: {
    defaultMessage: 'Failed to create new style.',
    id: 'admin/pages.editor.styles.new.fail',
  },
  newSuccess: {
    defaultMessage: 'New style created.',
    id: 'admin/pages.editor.styles.new.success',
  },
  saveFail: {
    defaultMessage: `Failed to select style '{name}'.`,
    id: 'admin/pages.editor.styles.select.save-fail',
  },
  saveSuccess: {
    defaultMessage: `Style '{name}' was selected.`,
    id: 'admin/pages.editor.styles.select.save-success',
  },
  undo: {
    defaultMessage: 'Undo',
    id: 'admin/pages.editor.styles.select.delete.toast.undo',
  },
})

const StyleList: React.FunctionComponent<Props> = ({
  startEditing,
  setStyleAsset,
}) => {
  const intl = useIntl()
  const [isCreatingStyle, setIsCreatingStyle] = useState(false)
  const { account, workspace } = useRuntime()

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
          <SendEventToAuditMutation>
            {sendEventToAudit => (
              <ToastConsumer>
                {({ showToast }) => (
                  <section className="flex flex-column ph3 h-100 overflow-x-hidden">
                    <header className="flex justify-between pv5 pl5 items-center flex-shrink-0 bg-white z-1">
                      <h1 className="f3 fw4">
                        <FormattedMessage
                          id="admin/pages.editor.styles.header.title"
                          defaultMessage="Styles"
                        />
                      </h1>
                      <ButtonWithIcon
                        icon={<CreateNewIcon />}
                        variation="tertiary"
                        isLoading={isCreatingStyle}
                        onClick={() => {
                          setIsCreatingStyle(true)
                          createStyle({
                            variables: {
                              name: intl.formatMessage(messages.defaultName),
                            },
                          })
                            .then(() => {
                              showToast({
                                horizontalPosition: 'left',
                                message: intl.formatMessage(
                                  messages.newSuccess
                                ),
                              })
                              const event = createEventObject(
                                'Create new style',
                                'style',
                                account,
                                workspace
                              )
                              sendEventToAudit({
                                variables: { input: event },
                              })
                            })
                            .catch(e => {
                              console.error(e)
                              showToast({
                                horizontalPosition: 'left',
                                message: intl.formatMessage(messages.newFail),
                              })
                            })
                            .finally(() => setIsCreatingStyle(false))
                        }}
                      >
                        <FormattedMessage
                          id="admin/pages.editor.styles.new-button.text"
                          defaultMessage="new"
                        />
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
                                .then(async () => {
                                  showToast({
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.saveSuccess,
                                      { name }
                                    ),
                                  })
                                  const event = createEventObject(
                                    'Select main style',
                                    'style',
                                    account,
                                    workspace,
                                    id
                                  )
                                  await sendEventToAudit({
                                    variables: { input: event },
                                  })
                                })
                                .catch(e => {
                                  console.error(e)
                                  showToast({
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.saveFail,
                                      {
                                        name,
                                      }
                                    ),
                                  })
                                })
                            }
                            deleteStyle={({ config, name, id }: Style) =>
                              deleteStyle({ variables: { id } })
                                .then(async () => {
                                  showToast({
                                    action: {
                                      label: intl.formatMessage(messages.undo),
                                      onClick: () => {
                                        createStyle({
                                          variables: { name, config },
                                        })
                                      },
                                    },
                                    duration: Infinity,
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.deleteSuccess,
                                      { name }
                                    ),
                                  })
                                  const event = createEventObject(
                                    'Delete style',
                                    'style',
                                    account,
                                    workspace,
                                    id
                                  )
                                  await sendEventToAudit({
                                    variables: { input: event },
                                  })
                                })
                                .catch(e => {
                                  console.error(e)
                                  showToast({
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.deleteFail
                                    ),
                                  })
                                  throw e
                                })
                            }
                            duplicateStyle={({ name, config }: Style) =>
                              createStyle({
                                variables: {
                                  config,
                                  name: intl.formatMessage(
                                    messages.duplicateDefaultName,
                                    { name }
                                  ),
                                },
                              })
                                .then(async () => {
                                  showToast({
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.duplicateSuccess,
                                      { name }
                                    ),
                                  })
                                  const event = createEventObject(
                                    'Create new style',
                                    'style',
                                    account,
                                    workspace
                                  )
                                  await sendEventToAudit({
                                    variables: { input: event },
                                  })
                                })
                                .catch(e => {
                                  console.error(e)
                                  showToast({
                                    horizontalPosition: 'left',
                                    message: intl.formatMessage(
                                      messages.duplicateFail,
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
            )}
          </SendEventToAuditMutation>
        )
      }}
    </Operations>
  )
}

export default StyleList
