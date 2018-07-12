import React, { Fragment, Component } from 'react'
import { Button } from 'vtex.styleguide'
import CheckIcon from '../../../images/check-2'

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
  state = {
    selectedI: null,
  }

  handleSelection = i => {
    this.setState({ selectedI: i })
  }

  render() {
    const regularItemClass = 'pa2'
    const selectedItemClass = 'ba bw2 b--blue relative'

    const isButtonDisabled = this.state.selectedI == null

    return (
      <Fragment>
        <div
          className="w-100 mt4 center ph3-ns overflow-y-auto"
          style={{ maxHeight: '300px' }}
        >
          {IMAGES.map((el, i) => {
            return (
              <div className="fl w-100 w-25-ns relative">
                <div
                  className={
                    i === this.state.selectedI
                      ? selectedItemClass
                      : regularItemClass
                  }
                  key={`${i}-im`}
                  onClick={() => this.handleSelection(i)}
                >
                  {i === this.state.selectedI && (
                    <div
                      className="absolute bg-blue bl bw2 b--blue"
                      style={{ right: '0' }}
                    >
                      <CheckIcon fill="#EEEEEE" />
                    </div>
                  )}
                  <img src={el} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex mt4 fr">
          <div className="pa2">
            <Button
              size="small"
              variation="secondary"
              disabled={isButtonDisabled}
              onClick={() => this.handleSelection(null)}
            >
              Cancel
            </Button>
          </div>
          <div className="pa2">
            <Button
              size="small"
              variation="primary"
              disabled={isButtonDisabled}
              onClick={() =>
                this.props.onImageSelect(IMAGES[this.state.selectedI])
              }
            >
              Insert
            </Button>
          </div>
        </div>
      </Fragment>
    )
  }
}
