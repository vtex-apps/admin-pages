import React, { Fragment, Component } from 'react'
import { Button } from 'vtex.styleguide'

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
    const regularItemClass = 'fl w-100 w-25-ns pa2'
    const selectedItemClass = 'fl w-100 w-25-ns ba bw1 b--light-blue'

    const isButtonDisabled = this.state.selectedI == null

    return (
      <Fragment>
        <div
          className="w-100 mt4 center ph3-ns overflow-y-auto"
          style={{ maxHeight: '300px' }}
        >
          {IMAGES.map((el, i) => {
            return (
              <div
                className={
                  i === this.state.selectedI
                    ? selectedItemClass
                    : regularItemClass
                }
                key={`${i}-im`}
                onClick={() => this.handleSelection(i)}
              >
                <img src={el} />
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
