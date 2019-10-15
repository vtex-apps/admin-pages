import React from 'react'

interface Props {
  color?: string
}

const ContentLibraryIcon: React.FC<Props> = ({ color = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="path-1-inside-1" fill="white">
      <rect width="13" height="13" rx="1" />
    </mask>

    <rect
      width="13"
      height="13"
      rx="1"
      stroke={color}
      strokeWidth="2.8"
      mask="url(#path-1-inside-1)"
    />

    <rect
      x="3.25"
      y="6.25"
      width="6.5"
      height="0.5"
      rx="0.25"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
    />

    <rect
      x="6.75"
      y="3.25"
      width="6.5"
      height="0.5"
      rx="0.25"
      transform="rotate(90 6.75 3.25)"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
    />

    <mask id="path-4-inside-2" fill="white">
      <path d="M15 3.5C15 3.22386 15.2239 3 15.5 3V3C15.7761 3 16 3.22386 16 3.5V15C16 15.5523 15.5523 16 15 16V16V3.5Z" />
    </mask>

    <path
      d="M15 3.5C15 3.22386 15.2239 3 15.5 3V3C15.7761 3 16 3.22386 16 3.5V15C16 15.5523 15.5523 16 15 16V16V3.5Z"
      fill={color}
    />

    <path
      d="M15 3.5V15H17V3.5H15ZM16 16V3.5H14V16H16ZM15 15V15V17C16.1046 17 17 16.1046 17 15H15ZM15.5 4C15.2239 4 15 3.77614 15 3.5H17C17 2.67157 16.3284 2 15.5 2V4ZM15.5 2C14.6716 2 14 2.67157 14 3.5H16C16 3.77614 15.7761 4 15.5 4V2Z"
      fill={color}
      mask="url(#path-4-inside-2)"
    />

    <mask id="path-6-inside-3" fill="white">
      <path d="M15 16L15 15L2.5 15C2.22386 15 2 15.2239 2 15.5V15.5C2 15.7761 2.22386 16 2.5 16L15 16Z" />
    </mask>

    <path
      d="M15 16L15 15L2.5 15C2.22386 15 2 15.2239 2 15.5V15.5C2 15.7761 2.22386 16 2.5 16L15 16Z"
      fill={color}
    />

    <path
      d="M15 16L16 16L16 17L15 17L15 16ZM15 15L15 14L16 14L16 15L15 15ZM14 16L14 15L16 15L16 16L14 16ZM15 16L2.5 16L2.5 14L15 14L15 16ZM2.5 15L15 15L15 17L2.5 17L2.5 15ZM3 15.5C3 15.2239 2.77614 15 2.5 15L2.5 17C1.67157 17 1 16.3284 1 15.5L3 15.5ZM2.5 16C2.77614 16 3 15.7761 3 15.5L1 15.5C1 14.6716 1.67157 14 2.5 14L2.5 16Z"
      fill="#3F3F40"
      mask="url(#path-6-inside-3)"
    />
  </svg>
)

export default ContentLibraryIcon
