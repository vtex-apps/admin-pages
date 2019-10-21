import React, { Component, createContext, useContext } from 'react'

import { ModalContext as ModalContextT } from './typings'

const defaultExternalState: ModalContextT = {
  close: () => {
    return
  },
  getIsOpen: () => false,
  getTextButtonAction: () => '',
  getTextButtonCancel: () => '',
  getTextMessage: () => '',
  isActionDanger: false,
  open: () => {
    return
  },
  textButtonAction: '',
  textButtonCancel: '',
  textMessage: '',
}

const ModalContext = createContext(defaultExternalState)

export const useModalContext = () => useContext(ModalContext)

export const ModalConsumer = ModalContext.Consumer

interface State extends ModalContextT {
  closeCallbackHandler?: () => void
  isOpen: boolean
}

export class ModalProvider extends Component<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      close: this.close,
      getIsOpen: this.getIsOpen,
      getTextButtonAction: this.getTextButtonAction,
      getTextButtonCancel: this.getTextButtonCancel,
      getTextMessage: this.getTextMessage,
      isActionDanger: false,
      isOpen: false,
      open: this.open,
      textButtonAction: '',
      textButtonCancel: '',
      textMessage: '',
    }
  }

  public render() {
    return (
      <ModalContext.Provider value={this.state}>
        {this.props.children}
      </ModalContext.Provider>
    )
  }

  private close: State['close'] = () => {
    this.setState(
      {
        isOpen: false,
      },
      () => {
        if (this.state.closeCallbackHandler) {
          this.state.closeCallbackHandler()
        }

        this.setState({
          actionHandler: undefined,
          cancelHandler: undefined,
          closeCallbackHandler: undefined,
          textButtonAction: '',
          textButtonCancel: '',
          textMessage: '',
        })
      }
    )
  }

  private getIsOpen: State['getIsOpen'] = () => this.state.isOpen

  private getTextButtonAction: State['getTextButtonAction'] = () =>
    this.state.textButtonAction

  private getTextButtonCancel: State['getTextButtonCancel'] = () =>
    this.state.textButtonCancel

  private getTextMessage: State['getTextMessage'] = () => this.state.textMessage

  private open: State['open'] = params => {
    this.setState(prevState => ({
      ...prevState,
      ...params,
      isActionDanger: (params && params.isActionDanger) || false,
      isOpen: true,
    }))
  }
}
