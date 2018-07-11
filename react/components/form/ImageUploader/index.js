import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import MediaCenter from './MediaCenter'
import UploadFile from '../../../queries/UpdateFile.gql'

class ImageUploader extends Component {
  state = {
    isLoading: false,
    isModalOpen: false,
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    const {
      schema: { title },
    } = this.props

    const FieldTitle = () => (
      <FormattedMessage id={title}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>
    )

    return (
      <Fragment>
        <FieldTitle />
        <div className="h-100 flex flex-column justify-center items-center">
          <Button
            size="small"
            variation="secondary"
            onClick={() => this.handleOpenModal()}
          >
            Upload
          </Button>
        </div>
        <MediaCenter
          isModalOpen={this.state.isModalOpen}
          closeModal={() => this.handleCloseModal()}
          {...this.props}
        />
      </Fragment>
    )
  }
}

ImageUploader.defaultProps = {
  disabled: false,
  value: '',
}

ImageUploader.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  uploadFile: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default graphql(UploadFile, { name: 'uploadFile' })(ImageUploader)
