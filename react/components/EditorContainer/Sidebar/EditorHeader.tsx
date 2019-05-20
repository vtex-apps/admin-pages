import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconArrowBack, Input } from 'vtex.styleguide'

interface Props {
  isTitleEditable?: boolean
  onClose: () => void
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
}

const EditorHeader: React.FC<Props> = ({
  isTitleEditable = false,
  onClose,
  onTitleChange,
  title,
}) => (
  <div className="w-100 ph5 pv4">
    <div className="w-100 flex justify-between">
      <div className="w-100 flex items-center">
        <span className="pointer" onClick={onClose}>
          <IconArrowBack color="#727273" size={12} />
        </span>

        <div className="w-100 pl3 flex justify-between items-center">
          {isTitleEditable ? (
            <FormattedMessage
              id="admin/pages.editor.components.configurations.defaultTitle"
              defaultMessage="Untitled"
            >
              {placeholder => (
                <Input
                  size="small"
                  value={title}
                  onChange={onTitleChange}
                  placeholder={placeholder}
                >
                  {title}
                </Input>
              )}
            </FormattedMessage>
          ) : (
            title && <h4 className="fw5 ma0 lh-copy f5 near-black">{title}</h4>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default EditorHeader
