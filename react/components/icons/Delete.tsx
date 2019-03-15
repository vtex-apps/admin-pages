import React from 'react'

interface Props {
  color?: string
}

const DeleteIcon: React.FunctionComponent<Props> = ({color}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={color}/>
    <path d="M11 5L5 11" stroke="white" strokeWidth="1.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5L11 11" stroke="white" strokeWidth="1.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

DeleteIcon.defaultProps = {
  color: 'currentColor',
}

export default DeleteIcon
