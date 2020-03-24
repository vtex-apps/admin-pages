import * as React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Button, IconLink, Input } from 'vtex.styleguide'

import StyleButton from './StyleButton'
import { useClickOutside } from './utils'

interface Props {
  onAdd: (text: string, link: string) => void
  getCurrentSelection: () => string | null
}

const messages = defineMessages({
  btn: {
    defaultMessage: 'Add',
    id: 'admin/pages.admin.rich-text-editor.add-button',
  },
  insertLink: {
    id: 'admin/pages.admin.rich-text-editor.link.title',
    defaultMessage: 'Insert link',
  },
  text: {
    defaultMessage: 'Text',
    id: 'admin/pages.admin.rich-text-editor.add-image.text-label',
  },
})

const LinkInput = ({ onAdd, getCurrentSelection }: Props) => {
  const intl = useIntl()
  const ref = React.useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = React.useState(false)
  const [link, setLink] = React.useState<string | undefined>()
  const [text, setText] = React.useState<string | undefined>()

  useClickOutside(ref, () => setIsOpen(false))

  const handleAddLink = () => {
    setIsOpen(false)
    if (text && link) {
      return onAdd(text, link)
    }
  }

  const handleToggleDialog = () => {
    if (isOpen) {
      return setIsOpen(false)
    }

    setText(getCurrentSelection() || undefined)
    setIsOpen(true)
  }

  return (
    <div className="relative" ref={ref}>
      <StyleButton
        title={intl.formatMessage(messages.insertLink)}
        active={isOpen}
        onToggle={handleToggleDialog}
        style={null}
        label={<IconLink />}
      />

      {isOpen && (
        <div className="flex flex-column absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5 z-1">
          <div className="mb4">
            <Input
              label={intl.formatMessage(messages.text)}
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setText(e.target.value)
              }
            />
          </div>
          <div className="mb4">
            <Input
              label={'URL'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLink(e.target.value)
              }
            />
          </div>
          <Button
            disabled={!text || !link}
            onClick={handleAddLink}
            size="small"
          >
            {intl.formatMessage(messages.btn)}
          </Button>
        </div>
      )}
    </div>
  )
}

export default LinkInput
