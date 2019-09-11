import * as React from 'react'
import { FormattedMessage } from 'react-intl'

import { IconCaretDown, IconCheck } from 'vtex.styleguide'

import StyleButton from './StyleButton'
import { useBlur } from './utils'

const BLOCK_TYPES = [
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.heading.unstyled"
        defaultMessage="Title"
      />
    ),
    style: 'unstyled',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.heading.header-one"
        defaultMessage="Title"
      />
    ),
    style: 'header-one',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.heading.header-two"
        defaultMessage="Title"
      />
    ),
    style: 'header-two',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.heading.header-three"
        defaultMessage="Title"
      />
    ),
    style: 'header-three',
  },
  {
    label: (
      <FormattedMessage
        id="admin/pages.admin.rich-text-editor.heading.header-four"
        defaultMessage="Title"
      />
    ),
    style: 'header-four',
  },
]

const hasActiveStyle = (style: string) => {
  return !!BLOCK_TYPES.find(block => block.style === style)
}

interface Props {
  onAdd: (link: string) => void
  activeStyle: string
}

const HeadingInput = ({ onAdd, activeStyle }: Props) => {
  const ref = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)

  useBlur(ref, () => setIsOpen(false))

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    style: string
  ) => {
    e.preventDefault()
    setIsOpen(false)
    onAdd(style)
  }

  return (
    <div className="relative" ref={ref}>
      <StyleButton
        title={
          <FormattedMessage
            id="admin/pages.admin.rich-text-editor.heading.title"
            defaultMessage="Styles"
          />
        }
        className="justify-between w4"
        active={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        style={null}
        label={
          <div className="flex flex-row justify-between items-center w-100">
            <FormattedMessage
              id={
                hasActiveStyle(activeStyle)
                  ? `admin/pages.admin.rich-text-editor.heading.${activeStyle}`
                  : `admin/pages.admin.rich-text-editor.heading.unstyled`
              }
              defaultMessage="Regular text"
            />
            <IconCaretDown size={8} />
          </div>
        }
      />

      {isOpen && (
        <div className="flex flex-column absolute bg-white b--solid b--muted-4 bw1 br2 w5">
          {BLOCK_TYPES.map(({ label, style }, index: number) => (
            <div
              key={index}
              className={`flex justify-between items-center pointer pa5 f${index} ${
                index > 0 ? 'b bt b--muted-4' : ''
              }`}
              role="presentation"
              onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleClick(e, style)
              }
            >
              {label}
              {style === activeStyle && <IconCheck />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(HeadingInput)
