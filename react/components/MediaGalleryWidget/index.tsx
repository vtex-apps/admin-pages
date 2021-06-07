import React from 'react'
import { ActionMenu, Spinner } from 'vtex.styleguide'
import EmptyState from '../form/ImageUploader/EmptyState'
import ImagePreview from '../form/ImageUploader/ImagePreview'
import { EXPERIMENTAL_Modal } from 'vtex.styleguide'
import { IconClose, IconOptionsDots } from 'vtex.styleguide'
import MediaGalleryWrapper from 'vtex.admin-cms/MediaGallery'
import styles from './styles.css'
import { FormattedMessage } from 'react-intl'
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
      onClick: () => {
        onChange?.(null)
      },
    },
  ]

  function handleImageSelected(imageUrl: string) {
    onChange?.(imageUrl)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  return (
    <>
      <FormattedMessage id={props.schema?.title ?? 'Image'}>
        {text => <span className="w-100 db mb3">{text}</span>}
      </FormattedMessage>

      <div
        className={styles.widget}
        style={{ width: '237px', height: '128px' }}
      >
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
              buttonProps={{
                variation: 'primary',
                icon: <IconOptionsDots color="currentColor" />,
              }}
            />
          </ImagePreview>
        ) : (
          <div onClick={() => setIsModalOpen(true)}>
            <EmptyState />
          </div>
        )}

        <EXPERIMENTAL_Modal
          size="large"
          showCloseIcon={false}
          showTopBar={false}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-label="widget-modal"
        >
          <div style={{ minHeight: '561px' }}>
            <MediaGalleryWrapper
              onImageSelected={handleImageSelected}
              onImageUploading={setIsLoading}
              onModalClose={handleCloseModal}
            />
            <div
              onClick={() => setIsModalOpen(false)}
              className={styles.iconCloseWrapper}
            >
              <IconClose />
            </div>
          </div>
        </EXPERIMENTAL_Modal>
      </div>
    </>
  )
}
