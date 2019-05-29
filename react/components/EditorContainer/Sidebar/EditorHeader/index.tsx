import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconArrowBack } from 'vtex.styleguide'

import EditableText from './EditableText'

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
}) => {
  const titleBaseClassName = 'w-100 ma0 lh-copy f5 fw5 near-black'

  return (
    <div className="w-100 ph5 pv4">
      <div className="w-100 flex justify-between">
        <div className="w-100 flex items-center">
          <span className="pointer" onClick={onClose}>
            <IconArrowBack color="#727273" size={12} />
          </span>

          <div className="w-100 pl3 flex justify-between items-center">
            {isTitleEditable ? (
              <FormattedMessage
                defaultMessage="Untitled content"
                id="admin/pages.editor.configuration.defaultTitle"
              >
                {placeholder => (
                  <EditableText
                    baseClassName={titleBaseClassName}
                    onChange={onTitleChange}
                    placeholder={placeholder as string}
                    value={title}
                  >
                    {title}
                  </EditableText>
                )}
              </FormattedMessage>
            ) : (
              <h4 className={`ba b--transparent ${titleBaseClassName}`}>
                {title}
              </h4>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader
