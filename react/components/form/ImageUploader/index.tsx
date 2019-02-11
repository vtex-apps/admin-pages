import { JSONSchema6 } from 'json-schema'
import React, { Component, Fragment } from 'react'
import { graphql, MutationFunc } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import URL from 'url-parse'
import { Button, Spinner } from 'vtex.styleguide'

import ImageIcon from '../../../images/ImageIcon'
import UploadFile from '../../../queries/UploadFile.graphql'

import Dropzone from './Dropzone'
import ErrorAlert from './ErrorAlert'

import styles from './imageUploader.css'

interface Props extends WidgetProps {
  disabled: boolean
  onChange: (pathname: string) => void
  schema: JSONSchema6
  uploadFile?: MutationFunc
  value: string
}

interface State {
  error: string | null
  isLoading: boolean
}

class ImageUploader extends Component<Props, State> {
  public static defaultProps = {
    disabled: false,
    value: '',
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      error: null,
      isLoading: false,
    }
  }

  public render() {
    const {
      disabled,
      schema: { title },
      value,
    } = this.props
    const { error, isLoading } = this.state

    const FieldTitle = () => (
      <FormattedMessage id={title as string}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>
    )

    const backgroundImageStyle = {
      backgroundImage: `url("${value}")`,
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
            onClick={this.handleErrorReset}
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
                  className={`w-100 h-100 absolute bottom-0 br2 flex flex-column items-center justify-center ${styles.gradient}`}
                >
                  <div className="flex justify-center mb3">
                    <ImageIcon stroke="#fff" />
                  </div>
                  <span className="white">Change image</span>
                </div>
              </div>
            )}
          </Dropzone>
          {error && <ErrorAlert message={error} />}
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
          onClick={this.handleErrorReset}
          onDrop={this.handleImageDrop}
        >
          <div className="h-100 flex flex-column justify-center items-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <Fragment>
                <div className="mb3">
                  <ImageIcon />
                </div>
                <div className="mb5 f6 tc gray">Drag your image here</div>
                <Button size="small" variation="secondary">
                  Upload
              </Button>
              </Fragment>
            )}
          </div>
        </Dropzone>
        {error && <ErrorAlert message={error} />}
      </Fragment>
    )
  }

  private handleImageDrop = async (acceptedFiles: string[]) => {
    const { uploadFile } = this.props as { uploadFile: MutationFunc }

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
          const fileUrlObj = new URL(fileUrl)

          this.props.onChange(fileUrlObj.pathname)

          this.setState({ isLoading: false })
        }
      } catch (e) {
        this.setState({
          error: 'Something went wrong. Please try again.',
          isLoading: false,
        })
      }
    } else {
      this.setState({
        error:
          'File exceeds the size limit of 4MB. Please choose a smaller one.',
      })
    }
  }

  private handleErrorReset = () => {
    this.setState({ error: null })
  }
}

export default graphql<Props>(UploadFile, { name: 'uploadFile' })(ImageUploader)
