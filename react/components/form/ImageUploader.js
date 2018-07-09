import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { RenderContextConsumer } from 'render'
import { Button, Spinner } from 'vtex.styleguide'

import CloseIcon from '../../images/CloseIcon'

class ImageUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      imageUrl: props.value || '',
    }
  }

  handleImageRemove = () => {
    this.props.onChange('')
    this.setState({ imageUrl: '' })
  }

  handleImageDrop = async (
    acceptedFiles,
    rejectedFiles,
    { account, workspace },
  ) => {
    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true })

      try {
        const BASE_URL = `https://${workspace}--${account}.myvtex.com`

        const imageName = acceptedFiles[0].name

        const response = await fetch(
          `${BASE_URL}/_v/save/${imageName}`, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            method: 'PUT',
            body: acceptedFiles[0],
          }
        )

        const { fileUrl } = await response.json()

        this.props.onChange(fileUrl)
        this.setState({ imageUrl: fileUrl, isLoading: false })
        this.setState({ isLoading: false })
      } catch (err) {
        console.log('Error: ', err)

        this.setState({ isLoading: false })
      }
    }
  }

  render() {
    const {
      disabled,
      schema: { title },
    } = this.props
    const { isLoading, imageUrl } = this.state

    const FieldTitle = () => <span className="w-100 db mb3"><FormattedMessage id={title} /></span>

    if (imageUrl) {
      return (
        <Fragment>
          <FieldTitle />
          <img src={imageUrl} />
          <div onClick={this.handleImageRemove}>
            <CloseIcon fill="#000" />
          </div>
        </Fragment>
      )
    }

    return (
      <RenderContextConsumer>
        {({ account, workspace }) => (
          <Fragment>
            <FieldTitle />
            <Dropzone
              className="w-100 h4 ba bw1 br3 b--dashed b--light-gray cursor"
              multiple={false}
              onDrop={(acceptedFiles, rejectedFiles) =>
                this.handleImageDrop(acceptedFiles, rejectedFiles, {
                  account,
                  workspace,
                })
              }
            >
              <div className="h-100 flex flex-column justify-center items-center">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Fragment>
                    <div className="mb4">Drag image here</div>
                    <Button
                      onClick={this.handleManualImageUpload}
                      size="small"
                      variation="secondary"
                    >
                      Upload
                    </Button>
                  </Fragment>
                )}
              </div>
            </Dropzone>
          </Fragment>
        )}
      </RenderContextConsumer>
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
  value: PropTypes.string,
}

export default injectIntl(ImageUploader)
