import React from 'react'

interface Props {
  color?: string
}

const IconEdit: React.FC<Props> = ({ color = '#979899' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5.2L15 2.4C15 2.0287 14.8525 1.6726 14.5899 1.41005C14.3274 1.1475 13.9713 1 13.6 1L2.4 1C2.0287 1 1.6726 1.1475 1.41005 1.41005C1.1475 1.6726 0.999999 2.0287 0.999999 2.4L1 13.6C1 13.9713 1.1475 14.3274 1.41005 14.5899C1.6726 14.8525 2.0287 15 2.4 15L5.2 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6L8.6329 15.8734L11.5549 12.9513L14.6037 16.0001L16.0001 14.6038L12.9513 11.555L15.8734 8.6329L6 6Z"
      fill={color}
    />
  </svg>
)

export default IconEdit
