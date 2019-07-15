import * as React from 'react'
import { graphql, MutationFunc } from 'react-apollo'
import { useDropzone } from 'react-dropzone'
import { defineMessages, InjectedIntl, injectIntl } from 'react-intl'

import { Button, IconClose, IconImage, Input, Spinner } from 'vtex.styleguide'

import StyleButton from './StyleButton'

import SeparatorWithLine from '../admin/pages/SeparatorWithLine'

import UploadFile from '../../queries/UploadFile.graphql'

interface MutationData {
  uploadFile: { fileUrl: string }
}

interface Props {
  intl: InjectedIntl
  onAdd: (imageUrl: string) => void
  uploadFile?: MutationFunc<MutationData>
}

const MAX_SIZE = 4 * 1024 * 1024

const messages = defineMessages({
  addBtn: {
    defaultMessage: 'Add',
    id: 'admin/pages.admin.rich-text-editor.add-button',
  },
  addLabel: {
    defaultMessage: 'Image URL',
    id: 'admin/pages.admin.rich-text-editor.add-image-label',
  },
  addPlaceholder: {
    defaultMessage: 'URL',
    id: 'admin/pages.admin.rich-text-editor.add-image-placeholder',
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
  uploadBtn: {
    defaultMessage: 'Upload image',
    id: 'admin/pages.admin.rich-text-editor.upload-button',
  },
  uploadLabel: {
    defaultMessage: 'Choose an image to upload',
    id: 'admin/pages.admin.rich-text-editor.upload-image-label',
  },
})

const ImageInput = ({ onAdd, intl, uploadFile }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState()
  const [error, setError] = React.useState<string | null>()

  const onDropImage = async (files: File[]) => {
    setError(null)

    try {
      if (files && files[0]) {
        setIsLoading(true)

        const {data: { uploadFile: { fileUrl} } } = await uploadFile!({ variables: { file: files[0] } }) as { data: MutationData }

        setIsLoading(false)
        setIsOpen(false)

        return onAdd(fileUrl)
      } else {
        return setError(intl.formatMessage(messages.fileSizeError))
      }
    } catch (err) {
      setError(intl.formatMessage(messages.genericError))
      setIsLoading(false)
    }
  }

  const {
    getInputProps,
    getRootProps,
  } = useDropzone({
    accept: 'image/*',
    maxSize: MAX_SIZE,
    multiple: false,
    onDrop: onDropImage,
  })

  const handleAddImage = () => {
    setIsOpen(false)
    return onAdd(imageUrl)
  }

  return (
    <div className="relative">
      <StyleButton 
        active={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        style={{}}
        label={<IconImage />}
      />

      {isOpen && (
        <div className="absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5">
          {isLoading && (
            <div className="absolute flex justify-center items-center top-0 left-0 h-100 w-100 br2 z-1 bg-black-05">
              <Spinner />
            </div>
          )}

          <div className={`flex flex-column ${isLoading && 'o-20'}`}>
            <div className="mb4">
              <Input
                label={intl.formatMessage(messages.addLabel)}
                onChange={(e: any) => setImageUrl(e.target.value)}
                placeholder={intl.formatMessage(messages.addPlaceholder)}
              />
            </div>

            <Button onClick={handleAddImage} size="small">
              { intl.formatMessage(messages.addBtn) }
            </Button>

            <SeparatorWithLine />

            <div className="flex flex-column">
              <span className="db mb3 w-100 c-on-base t-small">{intl.formatMessage(messages.uploadLabel)}</span>
              <div { ...getRootProps() } className="flex flex-column">
                <input { ...getInputProps() } />
                <Button size="small">{intl.formatMessage(messages.uploadBtn)}</Button>
              </div>
            </div>

            {error && (
              <div className="flex flex-row c-danger t-small justify-center items-center mt5">
                <IconClose />
                <span>{ error }</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default injectIntl(
  graphql<Props>(UploadFile, {
    name: 'uploadFile',
  })(ImageInput)
)