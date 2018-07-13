import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Tabs, Tab } from 'vtex.styleguide'

import Gallery from './Gallery'
import ImageTab from './ImageTab'

/** Component that holds a modal with the Image input and drag n drop and the Gallery. */
class MediaCenter extends React.Component {
  state = {
    currentTab: 1,
    isLoading: false,
    hasError: false,
  }

  handleClearImage = () => {
    this.props.onChange(null)
  }

  handleGallerySelect = image => {
    this.props.onChange(image)
    this.props.closeModal()
  }

  handleImageDrop = async (acceptedFiles, rejectedFiles) => {
    const { uploadFile, onChange } = this.props

    if (acceptedFiles && acceptedFiles[0]) {
      this.setState({ isLoading: true, hasError: false })

      try {
        const {
          data: {
            uploadFile: { fileUrl },
          },
        } = await uploadFile({
          variables: { file: acceptedFiles[0] },
        })

        if (fileUrl) {
          onChange(fileUrl)
        }
      } catch (e) {
        this.setState({ hasError: true })
        console.log('Error: ', e)
      }

      this.setState({ isLoading: false })
    }

    if (rejectedFiles && rejectedFiles[0]) {
      this.setState({ hasError: true })
      console.log(
        'Error: one or more files are not valid and, therefore, have not been uploaded.'
      )
    }
  }

  handleTabChange = tabIndex => {
    this.setState({
      currentTab: tabIndex,
      hasError: false,
    })
  }

  render() {
    const { value, disabled, isModalOpen, closeModal } = this.props
    const { isLoading, hasError, currentTab } = this.state

    const isButtonDisabled = value == null

    return (
      <div className="vtex-images-modal">
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div style={{ width: '45vw', height: '45vh' }}>
            <Tabs>
              <Tab
                label="Media upload"
                active={currentTab === 1}
                onClick={() => this.handleTabChange(1)}
              >
                <ImageTab
                  value={value}
                  isLoading={isLoading}
                  hasError={hasError}
                  disabled={disabled}
                  onImageDrop={this.handleImageDrop}
                />
                <div className="w-100 h-100 mt4 center ph3-ns">
                  <div className="flex mt4 fr">
                    <div className="pa2">
                      <Button
                        size="small"
                        variation="secondary"
                        disabled={isButtonDisabled}
                        onClick={() => this.handleClearImage()}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="pa2">
                      <Button
                        size="small"
                        variation="primary"
                        disabled={isButtonDisabled}
                        onClick={() => closeModal()}
                      >
                        Insert
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab
                label="Gallery"
                active={currentTab === 2}
                onClick={() => this.handleTabChange(2)}
              >
                <Gallery
                  onImageSelect={image => this.handleGallerySelect(image)}
                />
              </Tab>
            </Tabs>
          </div>
        </Modal>
      </div>
    )
  }
}

MediaCenter.propTypes = {
  /** Selected Image url.*/
  value: PropTypes.string.isRequired,
  /** Wether the Dropzone is enable or not.*/
  disabled: PropTypes.bool.isRequired,
  /** Wether the modal should be oppened.*/
  isModalOpen: PropTypes.bool.isRequired,
  /** Function to close the modal */
  closeModal: PropTypes.func.isRequired,
  /** Function that calls the mutation to upload the image*/
  uploadFile: PropTypes.func.isRequired,
  /** Function that updates the input field with the image url*/
  onChange: PropTypes.func.isRequired,
}

export default MediaCenter
