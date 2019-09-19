import { useKeydownFromClick } from 'keydown-from-click'
import React from 'react'
import { IconArrowBack } from 'vtex.styleguide'

interface Props {
  isTitleEditable?: boolean
  onClose: () => void
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  title?: string
}

const EditorHeader: React.FC<Props> = ({ onClose, title }) => {
  const handleKeyDown = useKeydownFromClick(onClose)

  const titleBaseClassName = 'w-100 ma0 lh-copy f5 fw5 near-black'

  return (
    <div className="w-100 ph5 pt4 pb2">
      <div className="w-100 flex justify-between">
        <div className="w-100 flex items-center">
          <span
            className="pointer outline-0"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <IconArrowBack color="#727273" size={12} />
          </span>

          <div className="w-100 pl3 flex justify-between items-center">
            <h4 className={`ba b--transparent ${titleBaseClassName}`}>
              {title}
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader
