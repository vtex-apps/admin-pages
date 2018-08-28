import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Input } from 'vtex.styleguide'

import DeleteRedirect from '../../../queries/DeleteRedirect.graphql'
import SaveRedirect from '../../../queries/SaveRedirect.graphql'

import Separator from './Separator'

interface CustomProps {
  closeForm: () => void
  deleteRedirect: (options: { variables: object }) => void
  onInputChange: (data: object) => void
  redirectInfo: Redirect
  saveRedirect: (options: object) => object
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  isLoading: boolean
}

class RedirectForm extends Component<Props, State> {
  private isViewMode: boolean

  constructor(props: Props) {
    super(props)

    this.isViewMode = props.redirectInfo.id !== 'new'

    this.state = { isLoading: false }
  }

  public render() {
    const {
      closeForm,
      intl,
      redirectInfo,
      redirectInfo: { from, to },
    } = this.props

    return (
      <div>
        <FormattedMessage
          id={
            this.isViewMode
              ? 'pages.admin.redirects.form.title.info'
              : 'pages.admin.redirects.form.title.new'
          }
        >
          {text => <h1>{text}</h1>}
        </FormattedMessage>
        <Separator />
        <form onSubmit={this.handleSave}>
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.from',
            })}
            onChange={(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.props.onInputChange({ from: event.target.value })
              }
            }}
            required
            value={from}
          />
          <Separator />
          <Input
            disabled={this.isViewMode}
            label={intl.formatMessage({
              id: 'pages.admin.redirects.table.to',
            })}
            onChange={(event: Event) => {
              if (event.target instanceof HTMLInputElement) {
                this.props.onInputChange({ to: event.target.value })
              }
            }}
            required
            value={to}
          />
          <Separator />
          <div className="flex justify-end">
            <div className="mr6">
              <Button
                disabled={this.state.isLoading}
                onClick={closeForm}
                size="small"
                variation="tertiary"
              >
                {intl.formatMessage({
                  id: this.isViewMode
                    ? 'pages.admin.redirects.form.button.back'
                    : 'pages.admin.redirects.form.button.cancel',
                })}
              </Button>
            </div>
            {this.isViewMode ? (
              <Button
                isLoading={this.state.isLoading}
                size="small"
                onClick={this.handleDelete(redirectInfo.id)}
                variation="danger"
              >
                {intl.formatMessage({
                  id: 'pages.admin.redirects.form.button.delete',
                })}
              </Button>
            ) : (
              <Button
                isLoading={this.state.isLoading}
                size="small"
                type="submit"
              >
                {intl.formatMessage({
                  id: 'pages.admin.redirects.form.button.create',
                })}
              </Button>
            )}
          </div>
        </form>
      </div>
    )
  }

  private handleDelete = (redirectId: string) => async () => {
    const { deleteRedirect, closeForm } = this.props

    this.setState({ isLoading: true })

    try {
      const data = await deleteRedirect({
        variables: {
          id: redirectId,
        },
      })

      console.log('OK!', data)

      closeForm()
    } catch (err) {
      // alert('Error removing page redirect configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  private handleSave = async () => {
    const {
      closeForm,
      redirectInfo: { endDate, from, to },
      saveRedirect,
    } = this.props

    this.setState({ isLoading: true })

    try {
      const data = await saveRedirect({
        variables: {
          endDate,
          from,
          to,
        },
      })

      console.log('OK!', data)

      closeForm()
    } catch (err) {
      // alert('Error saving page configuration.')

      console.log(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

export default compose(
  graphql(DeleteRedirect, {
    name: 'deleteRedirect',
  }),
  graphql(SaveRedirect, {
    name: 'saveRedirect',
  }),
  injectIntl,
)(RedirectForm)
