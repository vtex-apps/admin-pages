import React, { Component } from 'react'
import PropTypes from 'prop-types'

class EmptyPoint extends Component {
  render() {
    return (
      <svg width='48' height='37' viewBox='0 0 48 37' xmlns='http://www.w3.org/2000/svg'>
    <g id='Canvas' fill='none'>
        <g id='Group 4' filter='url(#filter0_d)'>
            <g id='Group 3'>
                <g id='drop-15'>
                    <g id='Group'>
                        <path d='M 17.2105 0.297829C 16.8426 -0.0992764 16.1564 -0.0992764 15.7886 0.297829C 15.1451 0.996188 0 17.5162 0 27.3724C 0 37.7803 8.38976 44 16.5 44C 24.6102 44 33 37.7803 33 27.3724C 33 17.5162 17.8549 0.996188 17.2105 0.297829Z'
                        transform='rotate(90 22.5 23.5)' fill='#368DF7' id='Vector' />
                    </g>
                </g>
            </g>
            <g id='simple-add'>
                <g id='Group_2'>
                    <g id='Vector_2'>
                        <path d='M 16.5 7.7L 9.9 7.7L 9.9 1.1C 9.9 0.44 9.46 0 8.8 0C 8.14 0 7.7 0.44 7.7 1.1L 7.7 7.7L 1.1 7.7C 0.44 7.7 0 8.14 0 8.8C 0 9.46 0.44 9.9 1.1 9.9L 7.7 9.9L 7.7 16.5C 7.7 17.16 8.14 17.6 8.8 17.6C 9.46 17.6 9.9 17.16 9.9 16.5L 9.9 9.9L 16.5 9.9C 17.16 9.9 17.6 9.46 17.6 8.8C 17.6 8.14 17.16 7.7 16.5 7.7Z'
                        transform='translate(10.8 8.7)' fill='#fff' />
                        <path d='M 16.5 7.7L 9.9 7.7L 9.9 1.1C 9.9 0.44 9.46 0 8.8 0C 8.14 0 7.7 0.44 7.7 1.1L 7.7 7.7L 1.1 7.7C 0.44 7.7 0 8.14 0 8.8C 0 9.46 0.44 9.9 1.1 9.9L 7.7 9.9L 7.7 16.5C 7.7 17.16 8.14 17.6 8.8 17.6C 9.46 17.6 9.9 17.16 9.9 16.5L 9.9 9.9L 16.5 9.9C 17.16 9.9 17.6 9.46 17.6 8.8C 17.6 8.14 17.16 7.7 16.5 7.7Z'
                        strokeWidth='0.5' transform='translate(10.8 8.7)' stroke='#fff' />
                    </g>
                </g>
            </g>
        </g>
    </g>
    <defs>
        <filter id='filter0_d' x='0' y='0' width='48' height='37' filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'>
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0'
            />
            <feOffset dy='1' />
            <feGaussianBlur stdDeviation='1' />
            <feColorMatrix values='0 0 0 0 0 0 0 0 0 0.288379 0 0 0 0 0.639738 0 0 0 1 0'
            />
            <feBlend in2='BackgroundImageFix' result='effect1_dropShadow' />
            <feBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
        </filter>
    </defs>
</svg>
    )
  }
}

EmptyPoint.propTypes = {
  fill: PropTypes.string,
}

export default EmptyPoint
