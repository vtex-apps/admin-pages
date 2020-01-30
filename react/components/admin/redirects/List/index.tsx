import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps as ComponentWithIntlProps,
} from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  IconUpload,
  Table,
  ToastConsumerFunctions,
} from 'vtex.styleguide'

import { getFormattedLocalizedDate } from '../../../../utils/date'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'
import CreateButton from './CreateButton'
import { messages } from './messages'

interface CustomProps {
  from: number
  items: Redirect[]
  loading: boolean
  onHandleDownload: () => void
  openModal: () => void
  refetch: () => void
  showToast: ToastConsumerFunctions['showToast']
  to: number
}

export type Props = CustomProps & ComponentWithIntlProps & RenderContextProps

interface State {
  schema: {
    items: Redirect[]
    properties: object
  }
}

class List extends Component<Props, State> {
  public static contextTypes = {
    culture: PropTypes.shape({ locale: PropTypes.string.isRequired })
      .isRequired,
  }

  public constructor(props: Props, context: RenderContext) {
    super(props)

    this.state = {
      schema: this.getSchema(props.items, context.culture.locale),
    }
  }

  public componentDidMount() {
    window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public componentDidUpdate(prevProps: Props) {
    const { locale } = this.context.culture
    const { from: currentFrom, items } = this.props

    if (
      prevProps.from !== currentFrom ||
      prevProps.loading !== this.props.loading
    ) {
      this.setState({ schema: this.getSchema(items, locale) })
    }
  }

  public render() {
    const { intl, loading, openModal, onHandleDownload } = this.props
    const { schema } = this.state

    const items = schema.items

    return (
      <>
        <Table
          fullWidth
          loading={loading}
          items={items}
          onRowClick={this.handleItemView}
          schema={schema}
          emptyStateLabel=""
          emptyStateChildren={
            <div className="pt5 flex flex-column tc">
              <div>
                <CreateButton onClick={this.handleNewItemOpen} />
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
              handleCallback: this.handleNewItemOpen,
              label: intl.formatMessage(messages.newLine),
            },
            upload: {
              handleCallback: this.handleUpload,
              label: intl.formatMessage(messages.upload),
            },
          }}
        />
      </>
    )
  }

  private getSchema = (items: Redirect[], locale: string) => {
    const { intl } = this.props

    return {
      items,
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
          cellRenderer: (cell: { cellData: string }) =>
            cell.cellData && cell.cellData === 'temporary' ? (
              <FormattedMessage
                id="admin/pages.admin.redirects.table.type.temporary"
                defaultMessage="Temporary (302)"
              >
                {text => <span className="ph4">{text}</span>}
              </FormattedMessage>
            ) : (
              <FormattedMessage
                id="admin/pages.admin.redirects.table.type.permanent"
                defaultMessage="Permanent (301)"
              >
                {text => <span className="ph4 silver">{text}</span>}
              </FormattedMessage>
            ),
        },
        endDate: {
          cellRenderer: (cell: { cellData: string }) =>
            cell.cellData ? (
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
            ),
          title: intl.formatMessage(messages.endDateTitle),
          type: 'string',
        },
      },
    }
  }

  private handleItemView = (event: { rowData: Redirect }) => {
    const { navigate } = this.props.runtime

    const selectedItem = event.rowData

    navigate({ to: `${BASE_URL}${selectedItem.from}` })
  }

  private handleNewItemOpen = () => {
    const { navigate } = this.props.runtime

    navigate({ to: `${BASE_URL}/${NEW_REDIRECT_ID}` })
  }

  private handleUpload = () => this.props.openModal()
}

export default withRuntimeContext(injectIntl(List))
