import React from 'react'
import { ActionMenu } from 'vtex.styleguide'
import EmptyState from '../form/ImageUploader/EmptyState'
import ImagePreview from '../form/ImageUploader/ImagePreview'
import { Modal } from 'vtex.styleguide'
import MediaGalleryWrapper from 'vtex.admin-cms/MediaGallery'
import styles from './styles.css'
import { FormattedMessage } from 'react-intl'

const imageMock = {
  url: '',
}

export default function MediaGalleryWidget(props) {
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
    <>
      <FormattedMessage id={props.schema?.title ?? 'Image'}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>

      <div
        className={styles.widget}
        style={{ width: '237px', height: '128px' }}
      >
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
    </>
  )
}
