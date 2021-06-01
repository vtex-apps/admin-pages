import React from 'react'
import { ActionMenu } from 'vtex.styleguide'
import EmptyState from '../form/ImageUploader/EmptyState'
import ImagePreview from '../form/ImageUploader/ImagePreview'
import { Modal } from 'vtex.styleguide'
import MediaGalleryWrapper from 'vtex.admin-cms/MediaGallery'
import styles from './styles.css'

const imageMock = {
  url: '',
}

export default function MediaGalleryWidget() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const options: ActionMenuOption[] = [
    {
      label: 'Replace',
      onClick: () => {},
    },
    {
      label: 'Remove',
      onClick: () => {},
    },
  ]

  return (
    <div className={styles.widget} style={{ width: '237px', height: '128px' }}>
      {imageMock.url ? (
        <ImagePreview imageUrl={imageMock.url}>
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
          container={document.querySelector('.widgetModal')}
          size="large"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-label="Payments Module"
          aria-describedby="modal-description"
        >
          <div style={{ minHeight: '561px' }}>
            <MediaGalleryWrapper />
          </div>
        </Modal>
      </div>
    </div>
  )
}
