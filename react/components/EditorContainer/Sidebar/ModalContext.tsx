import React, { Component, createContext } from 'react'

const ModalContext = createContext({})

export const ModalConsumer = ModalContext.Consumer

interface State {
  actionHandler: () => void
  cancelHandler: () => void
  close: () => void
  closeCallbackHandler?: () => void
  isLoading: boolean
  isOpen: boolean
  open: () => void
  setHandlers: (
    handlers: {
      actionHandler?: () => void
      cancelHandler?: () => void
      closeCallbackHandler?: () => void
    },
  ) => void
  toggleLoading: (callback?: () => void) => void
}

export class ModalProvider extends Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      actionHandler: () => {
        return
      },
      cancelHandler: () => {
        return
      },
      close: this.close,
      isLoading: false,
      isOpen: false,
      open: this.open,
      setHandlers: this.setHandlers,
      toggleLoading: this.toggleLoading,
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
      },
    )
  }

  private open: State['open'] = () => {
    this.setState({
      isOpen: true,
    })
  }

  private setHandlers: State['setHandlers'] = ({
    actionHandler,
    cancelHandler,
    closeCallbackHandler,
  }) => {
    this.setState(prevState => ({
      ...prevState,
      actionHandler: actionHandler || prevState.actionHandler,
      cancelHandler: cancelHandler || prevState.cancelHandler,
      closeCallbackHandler:
        closeCallbackHandler || prevState.closeCallbackHandler,
    }))
  }

  private toggleLoading: State['toggleLoading'] = callback => {
    this.setState(
      prevState => ({
        isLoading: !prevState.isLoading,
      }),
      () => {
        if (callback) {
          callback()
        }
      },
    )
  }
}
