import React, { Fragment, Component } from 'react'

const IMAGES = [
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-01.png',
  'https://raw.githubusercontent.com/vtex-apps/carousel/master/images/banners-mobile-02.png',
]

export default class Gallery extends Component {
  render() {
    return (
      <Fragment>
        {IMAGES.map((el, i) => {
          return (
            <div className="fl w-100 w-25-ns pa2" key={`${i}-im`}>
              <img src={el} />
            </div>
          )
        })}
      </Fragment>
    )
  }
}
