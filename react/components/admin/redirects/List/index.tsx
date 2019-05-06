import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ButtonWithIcon,
  EmptyState,
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
  to: number
  refetch: () => void
  showToast: ToastConsumerFunctions['showToast']
  openModal: () => void
}

export type Props = CustomProps &
  ReactIntl.InjectedIntlProps &
  RenderContextProps

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
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props, context: RenderContext) {
    super(props)

    this.state = {
      schema: this.getSchema(props.items, context.culture.locale),
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public componentDidUpdate(prevProps: Props) {
    const { locale } = this.context.culture
    const { from: currentFrom, items } = this.props

    if (prevProps.from !== currentFrom) {
      this.setState({ schema: this.getSchema(items, locale) })
    }
  }

  public render() {
    const { intl, openModal } = this.props
    const { schema } = this.state

    const items = schema.items

    return items.length === 0 ? (
      <EmptyState title={intl.formatMessage(messages.emptyState)}>
        <div className="pt5 flex flex-column tc">
          <div>
            <CreateButton onClick={this.openNewItem} />
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
      </EmptyState>
    ) : (
      <>
        <Table
          fullWidth
          items={items}
          onRowClick={this.viewItem}
          schema={schema}
          toolbar={{
            density: {
              buttonLabel: intl.formatMessage(messages.lineDensityLabel),
              highOptionLabel: intl.formatMessage(messages.lineDensityHigh),
              lowOptionLabel: intl.formatMessage(messages.lineDensityLow),
              mediumOptionLabel: intl.formatMessage(messages.lineDensityMedium),
            },
            download: {
              handleCallback: this.handleDownload,
              label: intl.formatMessage(messages.download),
            },
            fields: {
              hideAllLabel: intl.formatMessage(messages.hideAll),
              label: intl.formatMessage(messages.fieldsLabel),
              showAllLabel: intl.formatMessage(messages.showAll),
            },
            newLine: {
              handleCallback: this.openNewItem,
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
        // tslint:disable:object-literal-sort-keys
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
        // tslint:enable:object-literal-sort-keys
      },
    }
  }

  private openNewItem = () => {
    const { navigate } = this.props.runtime

    navigate({ to: `${BASE_URL}/${NEW_REDIRECT_ID}` })
  }

  private viewItem = (event: { rowData: Redirect }) => {
    const { navigate } = this.props.runtime

    const selectedItem = event.rowData

    navigate({ to: `${BASE_URL}/${selectedItem.id}` })
  }

  private handleUpload = () => this.props.openModal()

  private handleDownload() {
    window.open('/_v/private/pages/redirects.csv')
  }
}

export default withRuntimeContext(injectIntl(List))
