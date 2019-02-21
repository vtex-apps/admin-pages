import React, { Component, createContext, useContext } from 'react'

import { FormMetaContext } from './typings'

const defaultExternalState: FormMetaContext = {
  getWasModified: () => {
    return false
  },
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

export const useFormMetaContext = () => useContext(FormMetaContext)

export const FormMetaConsumer = FormMetaContext.Consumer

type State = FormMetaContext

export class FormMetaProvider extends Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = {
      ...defaultExternalState,
      getWasModified: this.getWasModified,
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

  private getWasModified: State['getWasModified'] = () => {
    return this.state.wasModified
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
      }
    )
  }
}
