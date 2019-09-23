import React, { Component, createContext, useContext } from 'react'

import { ModalContext as ModalContextT } from './typings'

const defaultExternalState: ModalContextT = {
  close: () => {
    return
  },
  getIsOpen: () => false,
  open: () => {
    return
  },
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
      isOpen: false,
      open: this.open,
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
        })
      }
    )
  }

  private getIsOpen: State['getIsOpen'] = () => this.state.isOpen

  private open: State['open'] = handlers => {
    this.setState(prevState => ({
      ...prevState,
      ...handlers,
      isOpen: true,
    }))
  }
}
