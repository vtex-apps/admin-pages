import React from 'react'
import { ActionMenu, Spinner, IconOptionsDots } from 'vtex.styleguide'
import MediaGallery from 'vtex.admin-cms/MediaGallery'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { JSONSchema6 } from 'json-schema'

import ImagePreview from '../form/ImageUploader/ImagePreview'
import EmptyState from '../form/ImageUploader/EmptyState'
import { useDropzone } from 'react-dropzone'

interface MediaGalleryWidgetProps {
  disabled?: boolean
  onChange?: (pathname: string | null) => void
  schema: JSONSchema6
  value: string
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

export default function MediaGalleryWidget(props: MediaGalleryWidgetProps) {
  const intl = useIntl()
  const { onChange, value } = props
  const [isImageUploading, setIsImageUploading] = React.useState(false)
  const modalState = MediaGallery.useModalState({ animated: true })
  const [previewUrl, setPreviewUrl] = React.useState('')
  const { createMedia } = MediaGallery.useCreateMedia({
    onImageSelected: handleImageSelected,
    onImagePreview: setPreviewUrl,
    onImageUploading: handleUploading,
    onError: handleError,
    modalState,
  })
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxSize: 4 * 10 ** 6,
    onDrop: acceptedFiles => {
      if (acceptedFiles?.[0]) {
        createMedia(acceptedFiles[0])
      } else {
        setError(intl.formatMessage(messages.fileSizeError))
      }
    },
  })
  const [error, setError] = React.useState<string | null>(null)

  const options: ActionMenuOption[] = [
    {
      label: 'Replace',
      onClick: () => {
        modalState.setVisible(true)

        setError(null)
      },
    },
    {
      label: 'Remove',
      onClick: () => {
        onChange?.(null)
      },
    },
  ]

  function handleUploading(isUploading: boolean) {
    setIsImageUploading(isUploading)
  }

  function handleImageSelected(imageUrl: string) {
    onChange?.(imageUrl)
  }

  const backgroundImagePreviewStyle = React.useMemo(
    () => ({
      backgroundImage: `url("${previewUrl}")`,
      height: '8rem',
    }),
    [previewUrl]
  )

  function handleError() {
    setError(intl.formatMessage(messages.genericError))
  }

  return (
    <>
      <FormattedMessage id={props.schema?.title ?? 'Image'}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>

      <div className="w-100">
        <>
          {isImageUploading ? (
            <div
              className="w-100 h-100 relative bg-center contain"
              style={backgroundImagePreviewStyle}
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-2 flex items-center justify-center">
                <Spinner />
              </div>
            </div>
          ) : value && !isDragActive ? (
            <div
              {...getRootProps({
                onClick: e => {
                  e.stopPropagation()
                  modalState.setVisible(true)
                },
              })}
            >
              <input {...getInputProps()} />
              <div style={{ height: '8rem' }}>
                <ImagePreview imageUrl={value}>
                  <ActionMenu
                    variation="primary"
                    menuWidth={200}
                    options={options}
                    buttonSize="small"
                    buttonProps={{
                      size: 'small',
                      variation: 'primary',
                      icon: <IconOptionsDots color="currentColor" />,
                    }}
                  />
                </ImagePreview>
              </div>

              {error && <p className="lh-copy f7 mt3 c-danger">{error}</p>}
            </div>
          ) : (
            <>
              <div
                {...getRootProps({
                  onClick: e => {
                    e.stopPropagation()
                    modalState.setVisible(true)
                  },
                })}
              >
                <input {...getInputProps()} />
                <EmptyState
                  style={
                    isDragActive
                      ? {
                          borderColor: '#134cd8',
                          color: '#134cd8',
                          width: '14.25rem',
                          height: '112px',
                        }
                      : {}
                  }
                />
              </div>
              {error && <p className="lh-copy f7 mt3 c-danger">{error}</p>}
            </>
          )}
        </>

        {modalState.visible && (
          <MediaGallery.Modal
            state={modalState}
            onImageSelected={handleImageSelected}
            onImageUploading={handleUploading}
            onImagePreview={setPreviewUrl}
            onError={handleError}
          />
        )}
      </div>
    </>
  )
}
