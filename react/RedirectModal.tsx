import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import DatePicker from 'react-datepicker'
import { Checkbox, Input, Modal } from 'vtex.styleguide'

import SavePageRedirect from './queries/SavePageRedirect.graphql'

class RedirectModal extends Component {
  public static propTypes = {
    handleInputChange: PropTypes.func,
    isModalOpen: PropTypes.bool,
    onClose: PropTypes.func,
    redirectInfo: PropTypes.object,
    savePageRedirect: PropTypes.func,
  }

  public static contextTypes = {
    culture: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      endDate: null
    }
  }

  public handleSave = (event: Event) => {
    event.preventDefault()
    const {fromUrl, toUrl, endDate, active} = this.props.redirectInfo
    const { savePageRedirect } = this.props
    savePageRedirect({
      variables: {
        active,
        endDate: endDate ? endDate.format() : '',
        fromUrl,
        toUrl,
      },
    })
    .then((data: any) => {
      console.log('OK!', data)
    })
    .catch((err: any) => {
      alert('Error saving page configuration.')
      console.log(err)
    })
  }

  render() {
    const {culture: {locale}} = this.context
    const {fromUrl, toUrl, endDate = null, active} = this.props.redirectInfo
    return (
      <div>
        <Modal
          centered
          isOpen={this.props.isModalOpen}
          onClose={this.props.onClose}
        >
        <form onSubmit={this.handleSave}>
          <Input
            value={fromUrl}
            label="FromUrl"
            onChange={(event: Event) => {
              this.props.handleInputChange({ fromUrl: event.target.value })
            }}
          />
          <Input
            value={toUrl}
            label="ToUrl"
            onChange={(event: Event) => {
              this.props.handleInputChange({ toUrl: event.target.value })
            }}
          />
          <DatePicker
            selected={endDate}
            locale={locale}
            onChange={(date: any) => {
              this.props.handleInputChange({endDate: date})
            }}
            showTimeSelect
            dateFormat="L — LT"
            timeIntervals={15}
            timeFormat="HH:mm"
          />
          <Checkbox
            checked={active}
            id="active"
            label="Active"
            name="default-checkbox-group"
            onChange={(event: Event) => {
              this.props.handleInputChange({ active: !(event.target.value === 'true') })
            }}
            value={active}
          />
          <input type="submit" value="Submit" />
        </form>
        </Modal>
      </div>
    )
  }
}

export default graphql(SavePageRedirect, {
  name: 'savePageRedirect',
  options: { fetchPolicy: 'cache-and-network' },
})(RedirectModal)

