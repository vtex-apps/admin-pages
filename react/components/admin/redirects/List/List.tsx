import React, { useEffect, useState, useCallback } from 'react'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  IconUpload,
  Table,
  ToastConsumerFunctions,
} from 'vtex.styleguide'
import { Binding } from 'vtex.tenant-graphql'

import { getFormattedLocalizedDate } from '../../../../utils/date'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'
import CreateButton from './CreateButton'
import { messages } from './messages'

interface CustomProps {
  from: number
  items: Redirect[]
  loading: boolean
  onHandleDownload: () => void
  onHandleInputSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  openModal: () => void
  refetch: () => void
  showToast: ToastConsumerFunctions['showToast']
  to: number
  storeBindings: Binding[]
}

export type Props = CustomProps

interface Schema {
  properties: object
}

enum CellData {
  TEMPORARY = 'TEMPORARY',
  PERMANENT = 'PERMANENT',
}

const getBindingAddress = (bindingId: string, storeBindings: Binding[]) =>
  storeBindings.find(({ id }) => id === bindingId)?.canonicalBaseAddress

function getSchema(intl: IntlShape, locale: string, storeBindings: Binding[]) {
  const bindingProperty =
    storeBindings.length > 1
      ? {
          binding: {
            title: intl.formatMessage(messages.tableBinding),
            type: 'string',
            cellRenderer: function Binding(cell: { cellData: CellData }) {
              const address = getBindingAddress(cell.cellData, storeBindings)
              return <span className="ph4">{address}</span>
            },
          },
        }
      : {}

  return {
    properties: {
      from: {
        title: intl.formatMessage(messages.tableFrom),
        type: 'string',
      },
      to: {
        title: intl.formatMessage(messages.tableTo),
        type: 'string',
      },
      type: {
        title: intl.formatMessage(messages.tableType),
        type: 'string',
        cellRenderer: function Type(cell: { cellData: CellData }) {
          return cell.cellData && cell.cellData === CellData.TEMPORARY ? (
            <FormattedMessage
              id="admin/pages.admin.redirects.table.type.temporary"
              defaultMessage="Temporary (302)"
            >
              {text => <span className="ph4 silver">{text}</span>}
            </FormattedMessage>
          ) : (
            <FormattedMessage
              id="admin/pages.admin.redirects.table.type.permanent"
              defaultMessage="Permanent (301)"
            >
              {text => <span className="ph4 silver">{text}</span>}
            </FormattedMessage>
          )
        },
      },
      ...bindingProperty,
      endDate: {
        cellRenderer: function EndDate(cell: { cellData: string }) {
          return cell.cellData ? (
            <span className="ph4">
              {getFormattedLocalizedDate(cell.cellData, locale)}
            </span>
          ) : (
            <FormattedMessage
              id="admin/pages.admin.redirects.table.endDate.default"
              defaultMessage="not set"
            >
              {text => <span className="ph4 silver">{text}</span>}
            </FormattedMessage>
          )
        },
        title: intl.formatMessage(messages.endDateTitle),
        type: 'string',
      },
    },
  }
}

const List: React.FC<Props> = ({
  from,
  items,
  loading,
  onHandleDownload,
  onHandleInputSearchChange,
  openModal,
  storeBindings,
}) => {
  const { culture, navigate } = useRuntime()
  const intl = useIntl()

  const [schema, setSchema] = useState<Schema>(() =>
    getSchema(intl, culture.locale, storeBindings)
  )

  useEffect(() => {
    window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }, [])

  useEffect(() => {
    setSchema(getSchema(intl, culture.locale, storeBindings))
  }, [culture.locale, from, intl, loading, storeBindings])

  const handleItemView = useCallback(
    (event: { rowData: Redirect }) => {
      const selectedItem = event.rowData
      const bindingQS = selectedItem.from.includes('?')
        ? `&binding=${selectedItem.binding}`
        : `?binding=${selectedItem.binding}`
      navigate({
        to: `${BASE_URL}${selectedItem.from}${bindingQS}`,
      })
    },
    [navigate]
  )

  const handleNewItemOpen = useCallback(() => {
    navigate({ to: `${BASE_URL}/${NEW_REDIRECT_ID}` })
  }, [navigate])

  return (
    <Table
      fullWidth
      loading={loading}
      items={items}
      onRowClick={handleItemView}
      schema={schema}
      emptyStateLabel=""
      emptyStateChildren={
        <div className="pt5 flex flex-column tc">
          <div>
            <CreateButton onClick={handleNewItemOpen} />
          </div>
          <p className="mv2">
            <FormattedMessage
              id="admin/pages.admin.redirects.or.text"
              defaultMessage="or"
            />
          </p>
          <div>
            <ButtonWithIcon
              icon={<IconUpload />}
              variation="secondary"
              onClick={openModal}
              size="small"
            >
              <FormattedMessage
                id="admin/pages.admin.redirects.emptyState.upload"
                defaultMessage="Upload a CSV"
              />
            </ButtonWithIcon>
          </div>
        </div>
      }
      toolbar={{
        inputSearch: {
          onChange: onHandleInputSearchChange,
        },
        density: {
          buttonLabel: intl.formatMessage(messages.lineDensityLabel),
          highOptionLabel: intl.formatMessage(messages.lineDensityHigh),
          lowOptionLabel: intl.formatMessage(messages.lineDensityLow),
          mediumOptionLabel: intl.formatMessage(messages.lineDensityMedium),
        },
        download: {
          disabled: items.length === 0,
          handleCallback: onHandleDownload,
          label: intl.formatMessage(messages.download),
        },
        fields: {
          hideAllLabel: intl.formatMessage(messages.hideAll),
          label: intl.formatMessage(messages.fieldsLabel),
          showAllLabel: intl.formatMessage(messages.showAll),
        },
        newLine: {
          handleCallback: handleNewItemOpen,
          label: intl.formatMessage(messages.newLine),
        },
        upload: {
          handleCallback: openModal,
          label: intl.formatMessage(messages.upload),
        },
      }}
    />
  )
}

export default List
