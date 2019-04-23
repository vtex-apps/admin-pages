import React from 'react'

interface Props {
  color?: string
}

const PaperIcon: React.FunctionComponent<Props> = ({ color }) => (
  <svg
    width="64"
    height="74"
    viewBox="0 0 64 74"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M53 53.8V1H1V65.8C1 69.7768 4.17436 73 8.09091 73"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
    <path
      d="M15.1739 65.8C15.1739 69.7768 11.9624 73 8 73H55.8261C59.7885 73 63 69.7768 63 65.8V61H15.1739V65.8Z"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
    <path
      d="M13 18H41"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
    <path
      d="M13 31H41"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
    <path
      d="M13 44H41"
      stroke={color}
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
  </svg>
)

PaperIcon.defaultProps = {
  color: 'currentColor',
}

export default React.memo(PaperIcon)
