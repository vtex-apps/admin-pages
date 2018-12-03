import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  onEdit: (event: any) => void
  onMouseEnter: (event: any) => void
  onMouseLeave: () => void
  title: string
  treePath: string
}

const ComponentButton = ({
  onEdit,
  onMouseEnter,
  onMouseLeave,
  title,
  treePath,
}: Props) => (
  <button
    className="dark-gray bg-white pt5 pointer hover-bg-light-silver w-100 tl bn ph0 pb0"
    data-tree-path={treePath}
    key={treePath}
    onClick={onEdit}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ animationDuration: '0.2s' }}
    type="button"
  >
    <div className="bb b--light-silver w-100 pb5">
      <span className="f6 fw5 pl5 track-1">
        <FormattedMessage id={title} />
      </span>
    </div>
  </button>
)

export default ComponentButton
