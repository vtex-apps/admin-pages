import React, { Component, createContext, useContext } from 'react'

import { FormMetaContext as FormMetaContextT } from './typings'

const defaultExternalState: FormMetaContextT = {
  addToI18nMapping: () => {
    return
  },
  clearI18nMapping: () => {
    return
  },
  getI18nMapping: () => {
    return {}
  },
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
  i18nMapping: Record<string, string>
  isLoading: boolean
  wasModified: boolean
}

export class FormMetaProvider extends Component<{}, State> {
  public constructor(props: {}) {
    super(props)

    this.state = {
      ...defaultExternalState,
      addToI18nMapping: this.addToI18nMapping,
      clearI18nMapping: this.clearI18nMapping,
      getI18nMapping: this.getI18nMapping,
      getWasModified: this.getWasModified,
      i18nMapping: {},
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

  private addToI18nMapping: State['addToI18nMapping'] = newEntry => {
    this.setState(prevState => ({
      ...prevState,
      i18nMapping: { ...prevState.i18nMapping, ...newEntry },
    }))
  }

  private clearI18nMapping: State['clearI18nMapping'] = () => {
    this.setState({ i18nMapping: {} })
  }

  private getI18nMapping: State['getI18nMapping'] = () => this.state.i18nMapping

  private getWasModified: State['getWasModified'] = () => this.state.wasModified

  private setWasModified: State['setWasModified'] = (newValue, callback) => {
    this.setState({ wasModified: newValue }, () => {
      if (callback) {
        callback()
      }
    })
  }
}
