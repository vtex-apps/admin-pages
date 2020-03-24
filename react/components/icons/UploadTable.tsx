import React from 'react'

const UploadTableIcon: React.FunctionComponent = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="60" r="60" fill="#F7F9FA" />
    <path
      d="M38 66H82V77C82 77.5523 81.5523 78 81 78H39C38.4477 78 38 77.5523 38 77V66Z"
      fill="#E3E4E6"
    />
    <rect x="42" y="71" width="8" height="2" rx="1" fill="#727273" />
    <rect x="56" y="71" width="8" height="2" rx="1" fill="#727273" />
    <rect x="74" y="71" width="4" height="2" rx="1" fill="#727273" />
    <path
      d="M82 54L38 54L38 43C38 42.4477 38.4477 42 39 42L81 42C81.5523 42 82 42.4477 82 43L82 54Z"
      fill="#F71963"
    />
    <rect
      x="78"
      y="49"
      width="4"
      height="2"
      rx="1"
      transform="rotate(180 78 49)"
      fill="white"
    />
    <rect
      x="64"
      y="49"
      width="8"
      height="2"
      rx="1"
      transform="rotate(180 64 49)"
      fill="white"
    />
    <rect
      x="50"
      y="49"
      width="8"
      height="2"
      rx="1"
      transform="rotate(180 50 49)"
      fill="white"
    />
    <path d="M38 54H82V66H38V54Z" fill="#CACBCC" />
    <rect x="42" y="59" width="8" height="2" rx="1" fill="#727273" />
    <rect x="56" y="59" width="8" height="2" rx="1" fill="#727273" />
    <rect x="74" y="59" width="4" height="2" rx="1" fill="#727273" />
  </svg>
)

export default React.memo(UploadTableIcon)
