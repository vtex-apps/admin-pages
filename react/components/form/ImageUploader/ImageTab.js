import React, { Component, Fragment } from 'react'
import { Button, Spinner } from 'vtex.styleguide'
import ImageIcon from '../../../images/ImageIcon'
import Dropzone from './Dropzone'
import PropTypes from 'prop-types'

/** Component responsible for displaying: the Dropzone, select image, spinner if it is on the loading state. */
export default class ImageTab extends Component {
  render() {
    const { value, isLoading, onImageDrop, disabled, hasError } = this.props

    const backgroundImageStyle = {
      backgroundImage: `url(${value})`,
      backgroundPosition: 'center',
    }

    return (
      <Fragment>
        {value ? (
          <Dropzone
            disabled={disabled || isLoading}
            extraClasses={`bg-light-gray vtex-page-editor__media-center ${
              !isLoading ? 'pointer' : ''
            }`}
            onDrop={onImageDrop}
          >
            {isLoading ? (
              <div className="w-100 h-100 flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <div
                className="w-100 h-100 relative bg-center contain"
                style={backgroundImageStyle}
              />
            )}
          </Dropzone>
        ) : (
          <Dropzone
            disabled={disabled || isLoading}
            extraClasses={`vtex-page-editor__media-center ba bw1 b--dashed b--light-gray ${
              !isLoading ? 'cursor' : ''
            }`}
            onDrop={onImageDrop}
          >
            <div className="h-100 flex flex-column justify-center items-center">
              {isLoading ? (
                <Spinner />
              ) : (
                <Fragment>
                  {hasError ? (
                    <div className="mb3 f4 fw5">
                      Something went wrong, please try again.
                    </div>
                  ) : (
                    <div className="mb3">
                      <ImageIcon stroke="#979899" />
                    </div>
                  )}
                  <div className="mb5 f6 mid-gray">Drag your image here or</div>
                  <Button size="small" variation="primary">
                    Upload a file
                  </Button>
                </Fragment>
              )}
            </div>
          </Dropzone>
        )}
      </Fragment>
    )
  }
}

ImageTab.propTypes = {
  /** Selected image URL */
  value: PropTypes.string,
  /** If an error has occured or not*/
  hasError: PropTypes.bool.isRequired,
  /** If still loading */
  isLoading: PropTypes.bool.isRequired,
  /** Should the input be disable */
  disabled: PropTypes.bool.isRequired,
  /** Function that handles image drop */
  onImageDrop: PropTypes.func.isRequired,
}
