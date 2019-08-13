import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import React, { Component, Fragment } from 'react'
import { graphql, MutationFunc } from 'react-apollo'
import {
  defineMessages,
  FormattedMessage,
  InjectedIntl,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { WidgetProps } from 'react-jsonschema-form'
import URL from 'url-parse'
import { Spinner } from 'vtex.styleguide'

import UploadFile from '../../../queries/UploadFile.graphql'

import Dropzone from './Dropzone'
import EmptyState from './EmptyState'
import ErrorAlert from './ErrorAlert'
import ImagePreview from './ImagePreview'

interface Props extends InjectedIntlProps {
  disabled?: boolean
  onChange?: (pathname: string | null) => void
  onFileDrop?: (file: File) => void
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
    value: '',
  }

  public constructor(props: Props) {
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

    return (
      <Fragment>
        <FormattedMessage id={title as string}>
          {text => <span className="w-100 db mb3">{text}</span>}
        </FormattedMessage>
        <Dropzone
          disabled={disabled || isLoading}
          extraClasses={classnames({
            'ba b--dashed bw1 b--light-gray': !value || isLoading,
            'bg-light-gray pointer': !!value,
            'bg-white b--solid': isLoading,
            cursor: !isLoading && !value,
          })}
          onClick={this.handleErrorReset}
          onDrop={this.handleImageDrop}
        >
          {isLoading ? (
            <div className="w-100 h-100 flex justify-center items-center">
              <Spinner />
            </div>
          ) : !!value ? (
            <ImagePreview imageUrl={value} />
          ) : (
            <EmptyState />
          )}
        </Dropzone>
        {error && <ErrorAlert message={error} />}
      </Fragment>
    )
  }

  private handleImageDrop = async (acceptedFiles: File[]) => {
    const { intl, uploadFile } = this.props as {
      intl: InjectedIntl
      uploadFile: MutationFunc<MutationData>
    }

    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true })

      try {
        let url = null

        if (uploadFile) {
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
          this.props.onChange(path)
        }

        if (this.props.onFileDrop) {
          this.props.onFileDrop(acceptedFiles[0])
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
