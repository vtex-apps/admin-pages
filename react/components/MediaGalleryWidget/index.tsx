import React from 'react'
import { ActionMenu, Spinner, IconOptionsDots } from 'vtex.styleguide'
import MediaGalleryModal from 'vtex.admin-cms/MediaGallery'
import { FormattedMessage } from 'react-intl'
import { JSONSchema6 } from 'json-schema'
import { useModalState } from '@vtex/admin-ui'

import ImagePreview from '../form/ImageUploader/ImagePreview'
import EmptyState from '../form/ImageUploader/EmptyState'

interface MediaGalleryWidgetProps {
  disabled?: boolean
  onChange?: (pathname: string | null) => void
  schema: JSONSchema6
  value: string
}

export default function MediaGalleryWidget(props: MediaGalleryWidgetProps) {
  const { onChange, value } = props
  const [isImageUploading, setIsImageUploading] = React.useState(false)
  const modalState = useModalState({ animated: true })
  const [previewUrl, setPreviewUrl] = React.useState('')

  const options: ActionMenuOption[] = [
    {
      label: 'Replace',
      onClick: () => modalState.setVisible(true),
    },
    {
      label: 'Remove',
      onClick: () => {
        onChange?.(null)
      },
    },
  ]

  function handleImageSelected(imageUrl: string) {
    onChange?.(imageUrl)
  }

  const backgroundImagePreviewStyle = React.useMemo(
    () => ({
      backgroundImage: `url("${previewUrl}")`,
    }),
    [previewUrl]
  )

  return (
    <>
      <FormattedMessage id={props.schema?.title ?? 'Image'}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>

      <div style={{ width: '14.8rem', height: '8rem' }}>
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
        ) : (
          <div
            tabIndex={0}
            role="button"
            onKeyPress={() => modalState.setVisible(true)}
            onClick={() => modalState.setVisible(true)}
          >
            <EmptyState />
          </div>
        )}

        <MediaGalleryModal
          state={modalState}
          onImageSelected={handleImageSelected}
          onImageUploading={setIsImageUploading}
          onImagePreview={setPreviewUrl}
        />
      </div>
    </>
  )
}
