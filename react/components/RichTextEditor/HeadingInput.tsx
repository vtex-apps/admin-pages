import * as React from 'react'
import { InjectedIntl, injectIntl, FormattedMessage } from 'react-intl'

import StyleButton from './StyleButton'

const BLOCK_TYPES = [
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.title-label"
        defaultMessage="Title"
      >
        {str => `${str} 1`}
      </FormattedMessage>
    ),
    style: 'header-one',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.title-label"
        defaultMessage="Title"
      >
        {str => `${str} 2`}
      </FormattedMessage>
    ),
    style: 'header-two',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.title-label"
        defaultMessage="Title"
      >
        {str => `${str} 3`}
      </FormattedMessage>
    ),
    style: 'header-three',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.title-label"
        defaultMessage="Title"
      >
        {str => `${str} 4`}
      </FormattedMessage>
    ),
    style: 'header-four',
  },
]

interface Props {
  onAdd: (link: string) => void
  activeStyle: string
  intl: InjectedIntl
}

// const messages = defineMessages({
//   btn: {
//     defaultMessage: 'Add',
//     id: 'admin/pages.admin.rich-text-editor.title-label',
//   },
// })

const HeadingInput = ({ onAdd, activeStyle }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    style: string
  ) => {
    e.preventDefault()
    setIsOpen(false)
    onAdd(style)
  }

  return (
    <div className="relative">
      <StyleButton
        active={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        style={null}
        label={activeStyle}
      />

      {isOpen && (
        <div className="flex flex-column absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5">
          {BLOCK_TYPES.map(({ label, style }, index: number) => (
            <div
              key={index}
              className={`f${index + 1} pointer pv3 b`}
              role="presentation"
              onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleClick(e, style)
              }
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(injectIntl(HeadingInput))
