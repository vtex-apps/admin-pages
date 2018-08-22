import moment, { Moment } from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import DatePicker from 'react-datepicker'
import { Checkbox, Input, Modal } from 'vtex.styleguide'

import SavePageRedirect from '../../../queries/SavePageRedirect.graphql'

interface Props {
  isModalOpen: boolean
  onClose: () => void
  onInputChange: (data: object) => void
  redirectInfo: Redirect
  savePageRedirect: (options: object) => object
}

class RedirectModal extends Component<Props> {
  public static contextTypes = {
    culture: PropTypes.object,
  }

  public render() {
    const {
      culture: { locale },
    } = this.context

    const {
      redirectInfo,
      redirectInfo: { active, fromUrl, toUrl },
    } = this.props

    const endDate = redirectInfo.endDate
      ? moment(redirectInfo.endDate)
      : moment(moment()).add(1, 'days')

    return (
      <div>
        <Modal
          centered
          isOpen={this.props.isModalOpen}
          onClose={this.props.onClose}
        >
          <form onSubmit={this.handleSave}>
            <Input
              label="FromUrl"
              onChange={(event: Event) => {
                if (event.target instanceof HTMLInputElement) {
                  this.props.onInputChange({ fromUrl: event.target.value })
                }
              }}
              value={fromUrl}
            />
            <Input
              label="ToUrl"
              onChange={(event: Event) => {
                if (event.target instanceof HTMLInputElement) {
                  this.props.onInputChange({ toUrl: event.target.value })
                }
              }}
              value={toUrl}
            />
            <div className="mb3 w-100 f6" />
            <DatePicker
              dateFormat="L — LT"
              locale={locale}
              onChange={(date: Moment) => {
                this.props.onInputChange({ endDate: date.format() })
              }}
              selected={endDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
            />
            <Checkbox
              checked={active}
              id="active"
              label="Active"
              name="default-checkbox-group"
              onChange={(event: Event) => {
                if (event.target instanceof HTMLInputElement) {
                  this.props.onInputChange({
                    active: !(event.target.value === 'true'),
                  })
                }
              }}
              value={active}
            />
            <input type="submit" value="Submit" />
          </form>
        </Modal>
      </div>
    )
  }

  private handleSave = async (event: Event) => {
    event.preventDefault()

    const {
      redirectInfo: { active, endDate, fromUrl, toUrl },
      savePageRedirect,
    } = this.props

    try {
      const data = await savePageRedirect({
        variables: {
          active,
          endDate,
          fromUrl,
          toUrl,
        },
      })

      console.log('OK!', data)
    } catch (err) {
      alert('Error saving page configuration.')

      console.log(err)
    }
  }
}

export default graphql(SavePageRedirect, {
  name: 'savePageRedirect',
  options: { fetchPolicy: 'cache-and-network' },
})(RedirectModal)
