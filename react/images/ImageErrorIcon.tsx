import PropTypes from 'prop-types'
import React from 'react'

const ImageErrorIcon: React.SFC<any> & {propTypes: any, defaultProps: any} = ({ stroke }) => (
  <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
    <g
      id="Artboard-3-Copy"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="image-delete" transform="translate(2.000000, 2.000000)">
        <path
          d="M8.5,15.5 L1.5,15.5 C0.948,15.5 0.5,15.052 0.5,14.5 L0.5,1.5 C0.5,0.948 0.948,0.5 1.5,0.5 L14.5,0.5 C15.052,0.5 15.5,0.948 15.5,1.5 L15.5,8.5"
          id="Shape"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          id="Shape"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="2.5 10.5 9.5 5.5 11.5 7.5"
        />
        <circle
          id="Oval"
          fill={stroke}
          fillRule="nonzero"
          cx="4.5"
          cy="4.5"
          r="1.5"
        />
        <path
          d="M11.5,11.5 L15.6231056,15.6231056"
          id="Shape"
          stroke="#FF4C4C"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5,11.5 L14.6231056,15.6231056"
          id="Shape"
          stroke="#FF4C4C"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(13.000000, 14.000000) scale(-1, 1) translate(-13.000000, -14.000000) "
        />
      </g>
    </g>
  </svg>
)

ImageErrorIcon.defaultProps = {
  stroke: '#979899',
}

ImageErrorIcon.propTypes = {
  stroke: PropTypes.string,
}

export default ImageErrorIcon
