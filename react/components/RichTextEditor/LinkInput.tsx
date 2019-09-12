import * as React from 'react'
import { defineMessages, InjectedIntl, injectIntl } from 'react-intl'

import { Button, IconLink, Input } from 'vtex.styleguide'

import StyleButton from './StyleButton'
import { useBlur } from './utils'

interface Props {
  onAdd: (text: string, link: string) => void
  getCurrentSelection: () => string | null
  intl: InjectedIntl
}

const messages = defineMessages({
  btn: {
    defaultMessage: 'Add',
    id: 'admin/pages.admin.rich-text-editor.add-button',
  },
})

const LinkInput = ({ onAdd, getCurrentSelection, intl }: Props) => {
  const ref = React.useRef(null)

  const [isOpen, setIsOpen] = React.useState(false)
  const [link, setLink] = React.useState()
  const [text, setText] = React.useState()

  useBlur(ref, () => setIsOpen(false))

  const handleAddLink = () => {
    setIsOpen(false)
    return onAdd(text, link)
  }

  const handleToggleDialog = () => {
    if (isOpen) {
      return setIsOpen(false)
    }

    setText(getCurrentSelection())
    setIsOpen(true)
  }

  return (
    <div className="relative" ref={ref}>
      <StyleButton
        title={intl.formatMessage({
          id: 'admin/pages.admin.rich-text-editor.link.title',
          defaultMessage: 'Insert link',
        })}
        active={isOpen}
        onToggle={handleToggleDialog}
        style={null}
        label={<IconLink />}
      />

      {isOpen && (
        <div className="flex flex-column absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5 z-1">
          <div className="mb4">
            <Input
              label={'Texto'}
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

export default injectIntl(LinkInput)
