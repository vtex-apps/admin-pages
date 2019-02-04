import PropTypes from 'prop-types'
import React from 'react'

const ImageIcon = ({ size, stroke }: any) => (
  <svg
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="Artboard"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        id="image-2"
        transform="translate(0.000000, 1.000000)"
        stroke={stroke}
        strokeWidth="1.4"
      >
        <ellipse
          id="Oval"
          cx="8.25"
          cy="3.83426966"
          rx="3"
          ry="3.06741573"
        />
        <polygon
          id="Shape"
          points="0.75 22.238764 6.75 13.0365169 9.75 16.1039326 15.75 8.43539326 23.25 22.238764"
        />
      </g>
    </g>
  </svg>
)

ImageIcon.defaultProps = {
  size: 16,
  stroke: '#979899'
}

ImageIcon.propTypes = {
  size: PropTypes.number,
  stroke: PropTypes.string,
}

export default ImageIcon
