import React, { Component, createContext } from 'react'

import { FormMetaContext } from './typings'

const defaultExternalState: FormMetaContext = {
  isLoading: false,
  setWasModified: () => {
    return
  },
  toggleLoading: () => {
    return
  },
  wasModified: false,
}

const FormMetaContext = createContext(defaultExternalState)

export const FormMetaConsumer = FormMetaContext.Consumer

type State = FormMetaContext

export class FormMetaProvider extends Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ...defaultExternalState,
      setWasModified: this.setWasModified,
      toggleLoading: this.toggleLoading,
    }
  }

  public render() {
    return (
      <FormMetaContext.Provider value={this.state}>
        {this.props.children}
      </FormMetaContext.Provider>
    )
  }

  private setWasModified: State['setWasModified'] = (newValue, callback) => {
    this.setState({ wasModified: newValue }, () => {
      if (callback) {
        callback()
      }
    })
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
