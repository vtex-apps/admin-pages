import { JSONSchema6 } from 'json-schema'
import React, { Component, Fragment } from 'react'
import { graphql, MutationFunc } from 'react-apollo'
import { ImageFile } from 'react-dropzone'
import {
  defineMessages,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import URL from 'url-parse'
import { Button, Spinner } from 'vtex.styleguide'

import ImageIcon from '../../../images/ImageIcon'
import UploadFile from '../../../queries/UploadFile.graphql'
import FieldTitle from '../FieldTitle'

import Dropzone from './Dropzone'
import ErrorAlert from './ErrorAlert'

import styles from './imageUploader.css'

interface Props extends InjectedIntlProps {
  disabled?: boolean
  shouldMutate?: boolean
  onChange: (pathname: string | null, file: ImageFile) => any
  schema: JSONSchema6
  uploadFile?: MutationFunc<MutationData>
  value: string
}

interface State {
  error: string | null
  isLoading: boolean
}

interface MutationData {
  uploadFile: { fileUrl: string }
}

const messages = defineMessages({
  fileSizeError: {
    defaultMessage:
      'File exceeds the size limit of 4MB. Please choose a smaller one.',
    id: 'admin/pages.editor.image-uploader.error.file-size',
  },
  genericError: {
    defaultMessage: 'Something went wrong. Please try again.',
    id: 'admin/pages.editor.image-uploader.error.generic',
  },
})

class ImageUploader extends Component<Props, State> {
  public static defaultProps = {
    disabled: false,
    shouldMutate: true,
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

    const backgroundImageStyle = {
      backgroundImage: `url("${value}")`,
    }

    if (value) {
      return (
        <Fragment>
          <FieldTitle title={title} />
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
                  className={`w-100 h-100 absolute bottom-0 br2 flex flex-column items-center justify-center ${
                    styles.gradient
                  }`}
                >
                  <div className="flex justify-center mb3">
                    <ImageIcon stroke="#fff" />
                  </div>
                  <span className="white">
                    <FormattedMessage
                      id="admin/pages.editor.image-uploader.change"
                      defaultMessage="Change image"
                    />
                  </span>
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
        <FieldTitle title={title} />
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
                <div className="mb5 f6 tc gray">
                  <FormattedMessage
                    id="admin/pages.editor.image-uploader.empty.text"
                    defaultMessage="Drag your image here"
                  />
                </div>
                <Button size="small" variation="secondary">
                  <FormattedMessage
                    id="admin/pages.editor.image-uploader.empty.button"
                    defaultMessage="Upload"
                  />
                </Button>
              </Fragment>
            )}
          </div>
        </Dropzone>
        {error && <ErrorAlert message={error} />}
      </Fragment>
    )
  }

  private handleImageDrop = async (acceptedFiles: ImageFile[]) => {
    const { intl, shouldMutate, uploadFile } = this.props

    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true })

      try {
        let url = null

        if (shouldMutate && uploadFile) {
          const {
            data: {
              uploadFile: { fileUrl },
            },
          } = (await uploadFile({
            variables: { file: acceptedFiles[0] },
          })) as { data: MutationData }
          url = fileUrl
        }

        if (this.props.onChange) {
          const path = url && new URL(url).pathname
          await this.props.onChange(path, acceptedFiles[0])
        }

        this.setState({ isLoading: false })
      } catch (e) {
        this.setState({
          error: intl.formatMessage(messages.genericError),
          isLoading: false,
        })
      }
    } else {
      this.setState({
        error: intl.formatMessage(messages.fileSizeError),
      })
    }
  }

  private handleErrorReset = () => {
    this.setState({ error: null })
  }
}

export default injectIntl(
  graphql<Props & (WidgetProps | {})>(UploadFile, {
    name: 'uploadFile',
  })(ImageUploader)
)
