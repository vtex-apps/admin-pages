import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'vtex.styleguide'

import ImageIcon from '../../../images/ImageIcon'
import UploadFile from '../../../queries/UpdateFile.gql'

import Dropzone from './Dropzone'

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
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  handleImageDrop = async (acceptedFiles, rejectedFiles) => {
    const { uploadFile } = this.props

    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true })

      try {
        const {
          data: {
            uploadFile: { fileUrl },
          },
        } = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        if (fileUrl) {
          this.props.onChange(fileUrl)
        }
      } catch (e) {
        console.log('Error: ', e)
      }

      this.setState({ isLoading: false })
    }

    if (rejectedFiles && rejectedFiles[0]) {
      console.log(
        'Error: one or more files are not valid and, therefore, have not been uploaded.',
      )
    }
  }

  render() {
    const {
      disabled,
      schema: { title },
      value,
    } = this.props
    const { isLoading } = this.state

    const FieldTitle = () => (
      <FormattedMessage id={title}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>
    )

    const backgroundImageStyle = {
      backgroundImage: `url(${value})`,
    }

    if (value) {
      return (
        <Fragment>
          <FieldTitle />
          <Dropzone
            disabled={disabled || isLoading}
            extraClasses={
              !isLoading ? 'bg-light-gray pointer' : 'ba bw1 b--light-gray'
            }
            onDrop={this.handleImageDrop}
          >
            {isLoading ? (
              <div className="w-100 h-100 flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <div
                className="w-100 h-100 relative bg-center contain"
                style={backgroundImageStyle}
              >
                <div
                  className="w-100 h-100 absolute bottom-0 br2 flex flex-column items-center justify-center"
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
            )}
          </Dropzone>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <FieldTitle />
        <Dropzone
          disabled={disabled || isLoading}
          extraClasses={`ba bw1 b--dashed b--light-gray ${
            !isLoading ? 'cursor' : ''
          }`}
          onDrop={this.handleImageDrop}
        >
          <div className="h-100 flex flex-column justify-center items-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Fragment>
                <div className="mb3">
                  <ImageIcon stroke="#979899" />
                </div>
                <div className="mb5 f6 gray">Drag your image here</div>
                <Button size="small" variation="secondary">
                  Upload
                </Button>
              </Fragment>
            )}
          </div>
        </Dropzone>
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
