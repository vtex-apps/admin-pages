import React from 'react'
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
          {title &&
            (isTitleEditable ? (
              <Input value={title} onChange={onTitleChange}>
                {title}
              </Input>
            ) : (
              <h4 className="fw5 ma0 lh-copy f5 near-black">{title}</h4>
            ))}
        </div>
      </div>
    </div>
  </div>
)

export default EditorHeader
