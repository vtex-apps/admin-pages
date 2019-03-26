import React from 'react'

interface Props {
  color?: string
}

const UndoIcon: React.FunctionComponent<Props> = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" fill="none" />
    <path
      d="M2.5 10H10C10.9283 10 11.8185 9.63125 12.4749 8.97487C13.1313 8.3185 13.5 7.42826 13.5 6.5C13.5 5.57174 13.1313 4.6815 12.4749 4.02513C11.8185 3.36875 10.9283 3 10 3H6.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6.5L2.5 10L6 13.5"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

UndoIcon.defaultProps = {
  color: '#134CD8',
}

export default UndoIcon
