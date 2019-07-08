import * as React from 'react'
import { defineMessages, injectIntl } from 'react-intl'

import { Button, IconImage, Input } from 'vtex.styleguide'

import StyleButton from './StyleButton'

interface Props {
  onAdd: (link: string) => void
  intl: any 
}

const messages = defineMessages({
  btn: {
    defaultMessage: 'Add',
    id: 'admin/pages.admin.rich-text-editor.add-button',
  },
  label: {
    defaultMessage: 'Image link',
    id: 'admin/pages.admin.rich-text-editor.add-image-label',
  },
  placeholder: {
    defaultMessage: 'Link',
    id: 'admin/pages.admin.rich-text-editor.add-image-placeholder',
  },
})

const ImageInput = ({ onAdd, intl }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [imageLink, setImageLink] = React.useState()

  const handleAddImage = () => {
    setIsOpen(false)
    return onAdd(imageLink)
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
        <div className="flex flex-column absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5">
          <div className="mb4">
            <Input
              label={intl.formatMessage(messages.label)}
              onChange={(e: any) => setImageLink(e.target.value)}
            />
          </div>
          <Button onClick={handleAddImage} size="small">
            { intl.formatMessage(messages.btn) }
          </Button>
        </div>
      )}
    </div>
  )
}

export default injectIntl(ImageInput)