import React from 'react'
import { ActionMenu, Spinner } from 'vtex.styleguide'
import EmptyState from '../form/ImageUploader/EmptyState'
import ImagePreview from '../form/ImageUploader/ImagePreview'
import { Modal } from 'vtex.styleguide'
import MediaGalleryWrapper from 'vtex.admin-cms/MediaGallery'
import styles from './styles.css'
import { JSONSchema6 } from 'json-schema'

interface MediaGalleryWidgetProps {
  disabled?: boolean
  onChange?: (pathname: string | null) => void
  schema: JSONSchema6
  value: string
}

export default function MediaGalleryWidget(props: MediaGalleryWidgetProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { onChange, value } = props
  const options: ActionMenuOption[] = [
    {
      label: 'Replace',
      onClick: () => setIsModalOpen(true),
    },
    {
      label: 'Remove',
      onClick: () => {},
    },
  ]

  function handleImageSelected(imageUrl: string) {
    onChange && onChange(imageUrl)
    setIsModalOpen(false)
  }

  return (
    <div className={styles.widget} style={{ width: '237px', height: '128px' }}>
      {isLoading ? (
        <div className="w-100 h-100 flex justify-center items-center">
          <Spinner />
        </div>
      ) : value ? (
        <ImagePreview imageUrl={value}>
          <ActionMenu
            variation="primary"
            menuWidth={200}
            options={options}
            buttonSize="small"
          />
        </ImagePreview>
      ) : (
        <div onClick={() => setIsModalOpen(true)}>
          <EmptyState />
        </div>
      )}
      <div className="widgetModal">
        <Modal
          container={
            window.top.document.getElementsByClassName('render-provider')[0]
          }
          size="large"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-label="Payments Module"
          aria-describedby="modal-description"
        >
          <div style={{ minHeight: '561px' }}>
            <MediaGalleryWrapper onImageSelected={handleImageSelected} />
          </div>
        </Modal>
      </div>
    </div>
  )
}
