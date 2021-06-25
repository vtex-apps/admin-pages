import React from 'react'
import { ActionMenu, Spinner, IconOptionsDots } from 'vtex.styleguide'
import MediaGallery from 'vtex.admin-cms/MediaGallery'
import { FormattedMessage } from 'react-intl'
import { JSONSchema6 } from 'json-schema'
// import { useModalState } from '@vtex/admin-ui'

import ImagePreview from '../form/ImageUploader/ImagePreview'
import EmptyState from '../form/ImageUploader/EmptyState'
import { useDropzone } from 'react-dropzone'

interface MediaGalleryWidgetProps {
  disabled?: boolean
  onChange?: (pathname: string | null) => void
  schema: JSONSchema6
  value: string
}

export default function MediaGalleryWidget(props: MediaGalleryWidgetProps) {
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
    onDrop: acceptedFiles => createMedia(acceptedFiles[0]),
  })
  const [error, setError] = React.useState(false)

  const options: ActionMenuOption[] = [
    {
      label: 'Replace',
      onClick: () => {
        modalState.setVisible(true)

        setError(false)
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

    setError(false)
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
    setError(true)
  }

  return (
    <>
      <FormattedMessage id={props.schema?.title ?? 'Image'}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>

      <div style={{ width: '14.8rem' }}>
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
          ) : value ? (
            <div style={{ height: '8rem' }}>
              <ImagePreview imageUrl={value}>
                <ActionMenu
                  variation="primary"
                  menuWidth={200}
                  options={options}
                  buttonSize="small"
                  buttonProps={{
                    variation: 'primary',
                    icon: <IconOptionsDots color="currentColor" />,
                  }}
                />
              </ImagePreview>

              {error && (
                <p className="lh-copy f7 mt3 c-danger">
                  Something went wrong. Please choose another file.
                </p>
              )}
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
              {error && (
                <p className="lh-copy f7 mt3 c-danger">
                  Something went wrong. Please choose another file.
                </p>
              )}
            </>
          )}
        </>

        <MediaGallery.Modal
          state={modalState}
          onImageSelected={handleImageSelected}
          onImageUploading={handleUploading}
          onImagePreview={setPreviewUrl}
          onError={handleError}
        />
      </div>
    </>
  )
}
