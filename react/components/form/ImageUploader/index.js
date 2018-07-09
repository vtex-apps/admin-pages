import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { RenderContextConsumer } from 'render'
import { Button, Spinner } from 'vtex.styleguide'

import ImageIcon from '../../../images/ImageIcon'

import Dropzone from './Dropzone'

const GRADIENT_STYLES = {
  background:
    '-moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  background:
    '-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.83) 99%, rgba(0,0,0,0.83) 100%)',
  filter:
    "progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#d4000000',GradientType=0)",
}

class ImageUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  componentWillUnmount() {
    this.dropzoneRef = null
  }

  handleImageDrop = async (
    acceptedFiles,
    rejectedFiles,
    { account, workspace },
  ) => {
    if (rejectedFiles && rejectedFiles[0]) {
      console.log(
        'Error: one or more files are not valid and, therefore, have not been uploaded.',
      )
    }
    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true })

      try {
        const BASE_URL = `https://${workspace}--${account}.myvtex.com`

        const imageName = acceptedFiles[0].name

        const response = await fetch(`${BASE_URL}/_v/save/${imageName}`, {
          body: acceptedFiles[0],
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          method: 'PUT',
        })

        const { fileUrl } = await response.json()

        this.props.onChange(fileUrl)
      } catch (err) {
        console.log('Error: ', err)
      }

      this.setState({ isLoading: false })
    }
  }

  render() {
    const {
      disabled,
      schema: { title },
      value,
    } = this.props
    const { isLoading } = this.state

    const FieldTitle = () => <span className="w-100 db mb3">{title}</span>

    const backgroundImageStyle = {
      backgroundImage: `url(${value})`,
    }

    if (value) {
      return (
        <Fragment>
          <FieldTitle />
          <Dropzone
            disabled={disabled}
            extraClasses="bg-light-gray pointer"
            onDrop={(acceptedFiles, rejectedFiles) =>
              this.handleImageDrop(acceptedFiles, rejectedFiles, {
                account,
                workspace,
              })
            }
            refHandler={node => {
              this.dropzoneRef = node
            }}
          >
            <div
              className="w-100 h4 relative bg-center contain"
              style={backgroundImageStyle}
            >
              <div
                className="w-100 h-100 absolute bottom-0 br2 flex flex-column items-center justify-center"
                style={GRADIENT_STYLES}
              >
                <div
                  onClick={() => {
                    this.dropzoneRef.open()
                  }}
                >
                  <div className="flex justify-center mb3">
                    <ImageIcon stroke="#FFF" />
                  </div>
                  <span className="white">Change image</span>
                </div>
              </div>
            </div>
          </Dropzone>
        </Fragment>
      )
    }

    return (
      <RenderContextConsumer>
        {({ account, workspace }) => (
          <Fragment>
            <FieldTitle />
            <Dropzone
              disabled={disabled}
              extraClasses="ba bw1 b--dashed b--light-gray cursor"
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
