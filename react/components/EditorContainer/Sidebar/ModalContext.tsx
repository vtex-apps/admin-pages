import React, { Component, createContext } from 'react'

import { ModalContext } from './typings'

const defaultExternalState: ModalContext = {
  actionHandler: () => {
    return
  },
  cancelHandler: () => {
    return
  },
  close: () => {
    return
  },
  isOpen: false,
  open: () => {
    return
  },
  setHandlers: () => {
    return
  },
}

const ModalContext = createContext(defaultExternalState)

export const ModalConsumer = ModalContext.Consumer

type State = ModalContext

export class ModalProvider extends Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ...defaultExternalState,
      close: this.close,
      open: this.open,
      setHandlers: this.setHandlers,
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

          this.setState({ closeCallbackHandler: undefined })
        }
      },
    )
  }

  private open: State['open'] = () => {
    this.setState({
      isOpen: true,
    })
  }

  private setHandlers: State['setHandlers'] = handlers => {
    this.setState(prevState => ({
      ...prevState,
      actionHandler: handlers.actionHandler || prevState.actionHandler,
      cancelHandler: handlers.cancelHandler || prevState.cancelHandler,
      closeCallbackHandler:
        handlers.closeCallbackHandler || prevState.closeCallbackHandler,
    }))
  }
}
