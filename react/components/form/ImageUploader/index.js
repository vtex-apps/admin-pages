import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import MediaCenter from './MediaCenter'
import UploadFile from '../../../queries/UpdateFile.gql'
import ImageIcon from '../../../images/ImageIcon'

const GRADIENT_STYLES = {
  background:
    '-moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  background:
    '-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  filter:
    "progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#d4000000', GradientType=0)",
}

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
      value,
    } = this.props

    const FieldTitle = () => (
      <FormattedMessage id={title}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>
    )

    const backgroundImageStyle = {
      minHeight: '200px',
      backgroundImage: `url(${value})`,
      backgroundPosition: 'center',
    }

    return (
      <Fragment>
        <FieldTitle />
        {value ? (
          <div
            className="flex flex-column justify-center items-center border-box bw1 br2 b--solid outline-0 near-black b--light-gray hover-b--silver bg-white relative bg-center contain"
            style={backgroundImageStyle}
            onClick={() => this.handleOpenModal()}
          >
            <div
              className="w-100 absolute bottom-0 br2 flex flex-column items-center justify-center"
              style={GRADIENT_STYLES}
            >
              <Fragment>
                <div className="flex justify-center mb3">
                  <ImageIcon stroke="#FFF" />
                </div>
                <span className="white">Change image</span>
              </Fragment>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-column justify-center items-center border-box bw1 br2 b--solid outline-0 near-black b--light-gray hover-b--silver bg-white"
            style={backgroundImageStyle}
          >
            <Button
              size="small"
              variation="secondary"
              onClick={() => this.handleOpenModal()}
            >
              Add Image
            </Button>
          </div>
        )}

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
