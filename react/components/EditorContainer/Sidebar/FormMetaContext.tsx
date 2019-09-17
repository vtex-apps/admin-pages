import React, { Component, createContext, useContext } from 'react'

import { FormMetaContext as FormMetaContextT } from './typings'

const defaultExternalState: FormMetaContextT = {
  getWasModified: () => {
    return false
  },
  setWasModified: () => {
    return
  },
}

const FormMetaContext = createContext(defaultExternalState)

export const useFormMetaContext = () => useContext(FormMetaContext)

export const FormMetaConsumer = FormMetaContext.Consumer

interface State extends FormMetaContextT {
  isLoading: boolean
  wasModified: boolean
}

export class FormMetaProvider extends Component<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      ...defaultExternalState,
      getWasModified: this.getWasModified,
      isLoading: false,
      setWasModified: this.setWasModified,
      wasModified: false,
    }
  }

  public render() {
    return (
      <FormMetaContext.Provider value={this.state}>
        {this.props.children}
      </FormMetaContext.Provider>
    )
  }

  private getWasModified: State['getWasModified'] = () => this.state.wasModified

  private setWasModified: State['setWasModified'] = (newValue, callback) => {
    this.setState({ wasModified: newValue }, () => {
      if (callback) {
        callback()
      }
    })
  }
}
