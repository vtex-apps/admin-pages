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

interface State extends ModalContext {
  closeCallback?: () => void
}

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
        if (this.state.closeCallback) {
          this.state.closeCallback()
        }

        this.setState({ closeCallback: undefined })
      },
    )
  }

  private open: State['open'] = closeCallback => {
    this.setState({
      closeCallback,
      isOpen: true,
    })
  }

  private setHandlers: State['setHandlers'] = ({
    actionHandler,
    cancelHandler,
  }) => {
    this.setState(prevState => ({
      ...prevState,
      actionHandler: actionHandler || prevState.actionHandler,
      cancelHandler: cancelHandler || prevState.cancelHandler,
    }))
  }
}
