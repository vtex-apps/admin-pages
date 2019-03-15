import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { EmptyState, Table, Tag } from 'vtex.styleguide'

import { getFormattedLocalizedDate } from '../../../../utils/date'
import { BASE_URL, NEW_REDIRECT_ID } from '../consts'

import CreateButton from './CreateButton'

interface CustomProps {
  from: number
  items: Redirect[]
  to: number
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
    const { intl } = this.props
    const { schema } = this.state

    const items = schema.items

    return items.length === 0 ? (
      <EmptyState
        title={intl.formatMessage({
          id: 'pages.admin.redirects.emptyState',
        })}
      >
        <div className="pt5">
          <CreateButton onClick={this.openNewItem} />
        </div>
      </EmptyState>
    ) : (
      <Fragment>
        <div className="flex justify-end mb4">
          <CreateButton onClick={this.openNewItem} />
        </div>
        <Table
          fullWidth
          items={items}
          onRowClick={this.viewItem}
          schema={schema}
        />
      </Fragment>
    )
  }

  private getSchema = (items: Redirect[], locale: string) => {
    const { intl } = this.props

    return {
      items,
      properties: {
        // tslint:disable:object-literal-sort-keys
        from: {
          title: intl.formatMessage({
            id: 'pages.admin.redirects.table.from',
          }),
          type: 'string',
        },
        to: {
          title: intl.formatMessage({
            id: 'pages.admin.redirects.table.to',
          }),
          type: 'string',
        },
        type: {
          title: intl.formatMessage({
            id: 'pages.admin.redirects.table.type',
          }),
          type: 'string',
          cellRenderer: (cell: { cellData: string }) =>
            cell.cellData ? (
              <FormattedMessage
                id={`pages.admin.redirects.table.type.${cell.cellData}`}
              >
                {text => <span className="ph4">{text}</span>}
              </FormattedMessage>
            ) : (
              <FormattedMessage id="pages.admin.redirects.table.type.permanent">
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
              <FormattedMessage id="pages.admin.redirects.table.endDate.default">
                {text => <span className="ph4 silver">{text}</span>}
              </FormattedMessage>
            ),
          title: intl.formatMessage({
            id: 'pages.admin.redirects.table.endDate.title',
          }),
          type: 'string',
        },
        disabled: {
          cellRenderer: (cell: { cellData: boolean }) => (
            <div className="ph4">
              <Tag type={cell.cellData ? 'error' : 'success'}>
                {intl.formatMessage({
                  id: cell.cellData
                    ? 'pages.admin.redirects.table.status.inactive'
                    : 'pages.admin.redirects.table.status.active',
                })}
              </Tag>
            </div>
          ),
          title: intl.formatMessage({
            id: 'pages.admin.redirects.table.status.title',
          }),
          type: 'boolean',
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
}

export default compose(
  injectIntl,
  withRuntimeContext
)(List)
