import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import React, { Fragment, useMemo, useRef, useState } from 'react'
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

import ActionMenu from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/ActionMenu'
import { ActionMenuOption } from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'

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
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.admin.pages.form.field.array.item.delete',
  },
  edit: {
    defaultMessage: 'Edit',
    id: 'admin/pages.admin.pages.form.field.array.item.edit',
  },
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

const ImageUploader: React.FC<Props> = props => {
  const [state, setState] = useState<State>({ error: null, isLoading: false })
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const {
    disabled,
    intl,
    schema: { title },
    value,
  } = props
  const { error, isLoading } = state

  const handleImageDrop = async (acceptedFiles: File[]) => {
    const { uploadFile } = props as {
      uploadFile: MutationFunc<MutationData>
    }

    if (acceptedFiles && acceptedFiles[0]) {
      setState(prevState => ({ ...prevState, isLoading: true }))

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

        if (props.onChange) {
          const path = url && new URL(url).pathname
          props.onChange(path)
        }

        if (props.onFileDrop) {
          props.onFileDrop(acceptedFiles[0])
        }

        setState(prevState => ({ ...prevState, isLoading: false }))
      } catch (e) {
        setState({
          error: intl.formatMessage(messages.genericError),
          isLoading: false,
        })
      }
    } else {
      setState(prevState => ({
        ...prevState,
        error: intl.formatMessage(messages.fileSizeError),
      }))
    }
  }

  const handleErrorReset = () => {
    setState(prevState => ({ ...prevState, error: null }))
  }

  const options: ActionMenuOption[] = useMemo(
    () => [
      {
        label: intl.formatMessage(messages.edit),
        onClick: () => {
          if (dropZoneRef.current) {
            dropZoneRef.current.click()
          }
        },
      },
      {
        label: intl.formatMessage(messages.delete),
        onClick: () => {
          if (props.onChange) {
            props.onChange(null)
          }
        },
      },
    ],
    [intl, props.onChange, dropZoneRef]
  )

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
        onClick={handleErrorReset}
        onDrop={handleImageDrop}
        ref={dropZoneRef}
      >
        {isLoading ? (
          <div className="w-100 h-100 flex justify-center items-center">
            <Spinner />
          </div>
        ) : !!value ? (
          <ImagePreview imageUrl={value}>
            <ActionMenu
              variation="primary"
              menuWidth={200}
              options={options}
              buttonSize="small"
            />
          </ImagePreview>
        ) : (
          <EmptyState />
        )}
      </Dropzone>
      {error && <ErrorAlert message={error} />}
    </Fragment>
  )
}

ImageUploader.defaultProps = {
  disabled: false,
  value: '',
}

export default injectIntl(
  graphql<Props & (WidgetProps | {})>(UploadFile, {
    name: 'uploadFile',
  })(ImageUploader)
)
